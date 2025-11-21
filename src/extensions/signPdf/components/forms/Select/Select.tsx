import { Dropdown, IDropdownProps } from "office-ui-fabric-react";
import * as React from "react";
import { type FieldDefinition } from "../types";

type Props = FieldDefinition<IDropdownProps>;

export const Select = ({ field, ...props }: Props) => (
  <Dropdown
    {...props}
    data-test-id={field?.name}
    id={field?.name}
    {...field}
    options={(props.values || []).map(({ value, label }) => ({
      key: `${value}`,
      id: `${value}`,
      text: label,
    }))}
    defaultValue={props.defaultValue as string}
    onChange={(e, option) => field?.onChange(option?.key)}
    onBlur={(e) => field?.onBlur()}
  />
);

export default Select;
