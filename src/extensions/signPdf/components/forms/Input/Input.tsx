import { ITextFieldProps, TextField } from "office-ui-fabric-react";
import { type FieldDefinition } from "../types";
import * as React from "react";

type Props = FieldDefinition<ITextFieldProps>;

export const Input = ({ field, ...props }: Props) => {
  return (
    <TextField
      {...props}
      className={props.className}
      data-test-id={field?.name}
      id={field?.name}
      {...field}
      defaultValue={props.defaultValue as string}
      onBlur={(e) => field?.onBlur()}
      errorMessage={props.error as unknown as string}
    />
  );
};

export default Input;
