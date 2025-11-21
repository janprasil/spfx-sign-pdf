import { ChoiceGroup, IChoiceGroupProps } from "office-ui-fabric-react";
import * as React from "react";
import { type FieldDefinition } from "../types";

type Props = FieldDefinition<IChoiceGroupProps>;

export const RadioList = ({ field, ...props }: Props) => {
  return (
    <ChoiceGroup
      {...props}
      data-test-id={field?.name}
      id={field?.name}
      {...field}
      defaultValue={props.defaultValue as string}
      onBlur={(e) => field?.onBlur()}
      onChange={(ev, option) => {
        field?.onChange(option?.key);
      }}
      styles={{
        flexContainer: "tw-grid tw-grid-cols-4",
      }}
      defaultSelectedKey={props.defaultValue}
      selectedKey={field?.value}
      options={props.options?.map((option) => ({
        ...option,
        selectedImageSrc: option.imageSrc,
        styles: {
          choiceFieldWrapper: "tw-w-full",
          innerField: "tw-pl-0 tw-pr-0",
        },
      }))}
    />
  );
};

export default RadioList;
