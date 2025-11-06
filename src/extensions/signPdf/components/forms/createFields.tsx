import React, { Fragment, forwardRef, useEffect, useMemo } from "react";
import get from "lodash/get";
import {
  Controller,
  useFormContext,
  type UseControllerReturn,
} from "react-hook-form";
import {
  type BaseFormValue,
  type FieldDefinition,
  type InjectedValidationFunctions,
  type OuterFieldDefinition,
  type Validate,
} from "./types";

const validateWrapper =
  <T extends BaseFormValue>(
    validate: Validate<T> | Validate<T>[],
    name: string,
    { clearErrors, getValues, setError }: InjectedValidationFunctions
  ) =>
  async (value: T) => {
    await Promise.all(
      new Array(validate).flat().map(async (singleValidate) => {
        const validationResult = await singleValidate?.(value, {
          clearErrors,
          getValues,
          name,
          setError,
        });
        if (validationResult.isError) {
          const { message } = validationResult;
          throw new Error(message);
        }
      })
    );
    return true;
  };

function createField<
  CustomProps extends object = object,
  T extends BaseFormValue = BaseFormValue
>(Field: React.FC<FieldDefinition<CustomProps, T>>) {
  const FieldWithTypes = Field as React.FC<
    OuterFieldDefinition<
      Omit<Partial<CustomProps>, "defaultValue" | "onChange" | "onBlur">,
      T
    >
  >;
  return forwardRef(function formField(
    props: OuterFieldDefinition<
      Omit<Partial<CustomProps>, "defaultValue" | "onChange" | "onBlur">,
      T
    >,
    ref
  ) {
    const {
      clearErrors,
      control,
      formState,
      getValues,
      register,
      resetField,
      setError,
      unregister,
    } = useFormContext();

    const messages = useMemo(
      () => ({
        label: props.label,
        placeholder: props.placeholder,
      }),
      [props.label, props.placeholder]
    );

    const error = useMemo(
      () => get(formState.errors, props.name, null),
      [props.name, formState]
    );

    const rules = useMemo(() => {
      const validate =
        props.validate &&
        validateWrapper(props.validate, props.name, {
          clearErrors,
          getValues,
          resetField,
          setError,
          unregister,
        });
      return { validate };
    }, [props.name, props.validate, setError, getValues]);

    register(props.name, {
      onBlur: (event) => {
        props.onBlur?.(event.target.value);
      },
      onChange: (event) => {
        props.onChange?.(event.target.value);
      },
      validate: rules.validate,
    });

    useEffect(
      () => () =>
        unregister(props.name, {
          keepValue: true,
        }),
      []
    );

    return (
      <Controller
        name={props.name}
        control={control}
        key={props.name}
        render={({ field }: UseControllerReturn) => {
          const newField = { ...field };
          newField.value = props.parse?.(newField.value) || newField.value;
          newField.onChange = (value: T) =>
            field.onChange(props.format?.(value) || value);
          // eslint-disable-next-line
          // @ts-ignore
          if (ref) ref.current = newField;
          return (
            <div>
              <FieldWithTypes
                {...props}
                {...messages}
                defaultValue={undefined}
                error={error?.message}
                field={newField}
                color={error?.message ? "failure" : undefined}
                helperText={
                  error?.message ? <Fragment>{error.message}</Fragment> : null
                }
              />
            </div>
          );
        }}
        defaultValue={props.defaultValue || ""}
      />
    );
  });
}

export default createField;
