import * as React from "react";
import {
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";
import {
  type FieldValues,
  FormProvider as ReactHookFormProvider,
  type UseFormReturn,
} from "react-hook-form";

type Props<T extends FieldValues> = PropsWithChildren<
  UseFormReturn<T, object> & { setHandlers: any }
>;

type FormContextType = {
  formErrors: Array<any>;
  submitting: boolean;
};

export const FormContext = createContext<FormContextType>({
  formErrors: [],
  submitting: false,
});

const FormProvider = <T extends Record<string, any> = object>({
  children,
  setHandlers,
  ...form
}: Props<T>) => {
  const [formErrors, setFormErrors] = useState<FormContextType["formErrors"]>(
    []
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setHandlers(setFormErrors, setSubmitting);
  }, []);

  return (
    <FormContext.Provider
      value={{
        formErrors,
        submitting,
      }}
    >
      <ReactHookFormProvider {...form}>{children}</ReactHookFormProvider>
    </FormContext.Provider>
  );
};

export default FormProvider;
