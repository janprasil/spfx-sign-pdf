import * as React from "react";
import { validator } from "../utils/validator";

export const useLittleForm = <T extends object = {}>() => {
  const [state, setState] = React.useState<T>({} as T);
  const [globalError, setGlobalError] = React.useState<string>();
  const [errors, setErrors] = React.useState<Record<keyof T, string>>(
    {} as any // eslint-disable-line
  );

  const onChange = <E extends React.FormEvent<HTMLInputElement>>(
    e: E,
    newValue: any // eslint-disable-line
  ) =>
    setState((state) => ({
      ...state,
      [(e.target as any).name]: newValue,
    }));

  const validate = validator(state, setGlobalError, (fieldName, message) => {
    setErrors((errors) => ({
      ...errors,
      [fieldName]: message,
    }));
  });

  return {
    input: {
      onChange,
    },

    getFormValue: <X extends keyof T>(name: X) => state[name] as T[X],
    formData: state,
    setValue: <X extends keyof T>(
      name: X,
      value: T[X] | ((prev: T[X]) => T[X])
    ) =>
      typeof value === "function"
        ? setState((prev) => ({ ...state, [name]: (value as any)(prev[name]) }))
        : setState({ ...state, [name]: value }),
    hasErrors: Object.keys(errors).length > 0 || !!globalError,
    globalError,
    validate,
  };
};
