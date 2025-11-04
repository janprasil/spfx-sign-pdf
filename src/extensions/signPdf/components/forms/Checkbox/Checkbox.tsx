import { Checkbox as UICheckbox, ICheckboxProps } from "office-ui-fabric-react";
import { type FieldDefinition } from "../types";
import * as React from "react";

type Props = FieldDefinition<ICheckboxProps>;

export const Checkbox = ({ field, ...props }: Props) => (
  <UICheckbox
    {...props}
    className={props.className}
    data-test-id={field?.name}
    id={field?.name}
    {...field}
    onBlur={(e) => field?.onBlur()}
    type={undefined}
    defaultChecked={props.defaultValue as boolean}
    defaultValue={undefined}
    checked={field?.value as boolean}
    onChange={(e, v) => {
      props.onChange?.(v);
      field?.onChange(e);
    }}
  />
);

export default Checkbox;
