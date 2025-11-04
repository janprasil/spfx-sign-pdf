export const UNKNOWN_ERROR = "unknown_error";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class FieldValidationError extends Error {
  fieldName: string;

  constructor(fieldName: string, message: string) {
    super(message);
    this.fieldName = fieldName;
    this.name = "FieldValidationError";
  }
}

export const validator =
  <T extends {}>(
    state: T,
    onGlobalError?: (message: string) => void,
    onFieldError?: (fieldName: keyof T, message: string) => void
  ) =>
  (fn: (formData: T) => void, onSuccess?: (formData: T) => void) => {
    try {
      fn(state);
      onSuccess?.(state);
      // eslint-disable-next-line
    } catch (e: any) {
      if (e.name === "ValidationError") {
        onGlobalError?.(e.message);
      } else if (e.name === "FieldValidationError") {
        onFieldError?.(e.fieldName, e.message);
      } else {
        onGlobalError?.(UNKNOWN_ERROR);
      }
    }
  };
