import { type ReactElement } from "react";
import {
  type UseControllerReturn,
  type useFormContext,
  type UseFormReturn,
} from "react-hook-form";
import { type z } from "zod";

export type BaseFormValue = string | boolean | number | object | any;
export type FieldList = Record<string, Field>;
export type FormComponent = {
  formErrors?: Array<FormError>;
  formInvalid: boolean;
  submitting: boolean;
};

export type FormErrorMessages = {
  messages: Array<FormError>;
};

export type FormError = {
  code?: string;
  errorKey: string;
  errorText: string;
};

export type FieldListType<TSchema extends object> = {
  [x in keyof TSchema]: TSchema[x] extends Array<object>
    ? [FieldListType<TSchema[x][0]>]
    : TSchema[x] extends { label: string }
    ? FieldListType<TSchema[x]>
    : Partial<OuterFieldDefinition>;
};

export type FormConfig<
  TSchema extends z.ZodSchema,
  TSchemaFields = FieldListType<z.TypeOf<TSchema>>
> = {
  destroyOnUnmount?: boolean;
  fieldList: TSchemaFields;
  name: string;
  schema: TSchema;
};

type MessageWithValue = {
  values: object;
  message: string;
};

export type ValidateResult = {
  isError: boolean;
  message?: string;
  values?: object;
};

export type Validate<TFieldValue> = (
  value: TFieldValue,
  helpers: Partial<InjectedValidationFunctions & { name: string }>
) => ValidateResult | Promise<ValidateResult>;

export type OuterFieldDefinition<
  CustomProps extends object = object,
  T extends BaseFormValue = BaseFormValue
> = Omit<
  CustomProps,
  "onChange" | "onBlur" | "type" | "defaultValue" | "value"
> & {
  "data-testid"?: string;
  defaultValue?: T;
  format?: (value: T) => string;
  isDisabled?: boolean;
  keepOnUnmount?: boolean;
  label?: string;
  name: string;
  onBlur?: (value?: T) => void;
  onChange?: (value?: T) => void;
  parse?: (value: string) => T;
  placeholder?: string;
  type?:
    | "number"
    | "text"
    | "password"
    | "tel"
    | "email"
    | "search"
    | "date"
    | undefined;
  validate?: Validate<T> | Validate<T>[];
  values?: Array<{
    defaultValue?: BaseFormValue;
    label: string;
    value: BaseFormValue;
  }>;
};

export type InnerFieldDefinition = Omit<FieldDefinition, "validate"> & {
  control: ReturnType<typeof useFormContext>["control"];
};

export type FieldDefinition<
  CustomProps extends object = object,
  ValueType = BaseFormValue
> = Partial<OuterFieldDefinition<CustomProps>> &
  Partial<UseControllerReturn> & {
    currentValue?: ValueType;
    error?: FormError;
    getCurrentValue?: () => ValueType;
    reset?: () => void;
  };

export type InjectedValidationFunctions = {
  clearErrors: UseFormReturn["clearErrors"];
  getValues: UseFormReturn["getValues"];
  resetField: UseFormReturn["resetField"];
  setError: UseFormReturn["setError"];
  unregister: UseFormReturn["unregister"];
};

export type FormConfig = {
  destroyOnUnmount?: boolean;
  fieldList?: FieldList;
  formatters?: Record<string, any>;
  initialValues?: Record<string, any>;
  name: string;
  validate?: (...args: Array<any>) => any;
};

export type FormError = {
  code?: string;
  errorKey: string;
  errorText: string;
};
