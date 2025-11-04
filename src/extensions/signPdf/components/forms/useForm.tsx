import { get, noop } from "lodash";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import {
  useFieldArray,
  useForm as useReactHookForm,
  type Path,
  type UseFormProps,
} from "react-hook-form";
import * as React from "react";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import CustomFormProvider from "./FormProvider";
import {
  type BaseFormValue,
  type FormConfig,
  type OuterFieldDefinition,
} from "./types";

export type ArrayWrapperChildrenArgs<T extends object> = [
  ReturnType<typeof useFieldArray>,
  Array<FieldsType<T>>
];

export type ArrayWrapperType<T extends object> = React.FunctionComponent<{
  children: (
    ...args: ArrayWrapperChildrenArgs<T>
  ) => PropsWithChildren<unknown>["children"];
}>;

export type FieldsType<TSchema extends object> = {
  [x in keyof TSchema]: TSchema[x] extends Array<object>
    ? {
        ArrayWrapper: ArrayWrapperType<TSchema[x][0]>;
      }
    : TSchema[x] extends { label: string }
    ? FieldsType<TSchema[x]>
    : OuterFieldDefinition<object, BaseFormValue> & { name: string } & {
        getValue: () => string;
      };
};

const useForm = <
  TSchema extends z.ZodSchema,
  TFieldValues extends z.TypeOf<TSchema> = z.TypeOf<TSchema>
>(
  config: UseFormProps<TFieldValues> & FormConfig<TSchema>
) => {
  type TForm = z.TypeOf<typeof config.schema>;
  const [formErrors, _setFormErrors] = useState<Array<string>>([]);
  const [isSubmitting, _setSubmitting] = useState(false);
  const setFormErrorsRef = useRef(noop);
  const setSubmittingRef = useRef(noop);

  const setFormErrors = useCallback((errors: Array<string>) => {
    setFormErrorsRef.current?.(errors);
    _setFormErrors(formErrors);
  }, []);

  const setSubmitting = useCallback((flag: boolean) => {
    setSubmittingRef.current?.(flag);
    _setSubmitting(flag);
  }, []);

  const onSuccessSubmitDone = () => {
    setSubmitting(false);
  };

  const setHandlers = (
    setFormErrorsHandler: typeof setFormErrors,
    setSubmittingHandler: typeof setSubmitting
  ) => {
    setFormErrorsRef.current = setFormErrorsHandler;
    setSubmittingRef.current = setSubmittingHandler;
  };

  const form = useReactHookForm<TFieldValues>({
    criteriaMode: "firstError",
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
    resolver: config.schema ? zodResolver(config.schema) : undefined,
    ...config,
  });

  // eslint-disable-next-line
  const getFields = (fields: any, keys: Array<string> = []) => {
    const newField: any = {}; // eslint-disable-line
    Object.keys(fields).map((key) => {
      const name = [...keys, key].join(".");
      const field = fields[key];
      if (Array.isArray(field)) {
        newField[key] = {
          // eslint-disable-next-line
          ArrayWrapper: ({
            children,
          }: {
            children: (
              hook: any,
              fields: any
            ) => PropsWithChildren<unknown>["children"]; // eslint-disable-line
          }) => {
            const hook = useFieldArray({
              control: form.control,
              name: name as any, // eslint-disable-line
            });
            return children(
              hook,
              useMemo(
                () =>
                  hook.fields.map((item, i) =>
                    getFields(field[0], [...keys, key, `${i}`])
                  ),
                [hook.fields]
              )
            );
          },
        };
      } else if (field.label) {
        newField[key] = {
          ...field,
          name,
          getValue: () => get(form.getValues(), name),
        };
      } else {
        newField[key] = getFields(field, [...keys, key]);
      }
    });
    return newField;
  };

  const handleSubmit = React.useCallback(
    async <Res extends object>(
      onSubmit: (arg: {
        form: TForm;
        reject: () => void;
        resolve: (formFields: Res) => void;
      }) => Promise<void> | void,
      onSuccessSubmit?: (formFields: Res) => void
    ) => {
      setSubmitting(true);
      await form?.handleSubmit(
        (formData) =>
          new Promise<Res>((resolve, reject) => {
            onSubmit({
              form: formData,
              reject,
              resolve,
            });
          })
            .then((formFields: Res) => {
              onSuccessSubmit?.(formFields);
            })
            // eslint-disable-next-line
            .catch((errors: any) => {
              if (errors.data.zodError) {
                const { fieldErrors, formErrors } = errors.data.zodError as {
                  fieldErrors: Record<string, Array<string>>;
                  formErrors: Array<string>;
                };
                setFormErrors(formErrors);
                Object.entries(fieldErrors).forEach(([key, error]) => {
                  form.setError(key as Path<TFieldValues>, {
                    message: error[0],
                    type: "validate",
                  });
                });
              }
            })
            .finally(() => {
              setSubmitting(false);
            }),
        (invalid) => console.error(invalid)
      )();
    },
    [form]
  );

  const FormProvider = React.useCallback(
    ({ children }: PropsWithChildren<unknown>) => (
      <CustomFormProvider {...form} setHandlers={setHandlers}>
        {children}
      </CustomFormProvider>
    ),
    [form]
  );
  return {
    FormProvider,
    DevTool: () => {
      return <DevTool control={form.control} />;
    },
    values: form?.watch(),
    fields: config.fieldList,
    form,
    errors: { formErrors, fieldErrors: form.formState.errors },
    formInvalid: form.formState.touchedFields && !form?.formState.isValid,
    handleSubmit,
    initForm: (data: TFieldValues) => {
      form?.reset(data);
      form?.trigger();
    },
    onSuccessSubmitDone,
    resetFields: () => {
      form?.reset({} as TFieldValues);
      form?.trigger();
    },
    submitting: form?.formState.isSubmitting || isSubmitting,
    superFields: useMemo(
      () =>
        getFields(config.fieldList) as FieldsType<Required<z.TypeOf<TSchema>>>,
      []
    ),
  };
};

export default useForm;
