import "@pnp/sp/webs";
import { Icon, Text } from "office-ui-fabric-react";
import React, { useState } from "react";
import { SignatureFormSchema } from "../../schemas/SignatureForm.schema";
import { FileDefinition } from "../../types/files";
import { ArrayWrapperChildrenArgs, FieldsType } from "../forms/useForm";
import SignatureSingleFileForm from "./SignatureSingleFileForm";

export type SignatureItem = (typeof SignatureFormSchema._type.data)[0];
export type ArrayWrapperArgs = ArrayWrapperChildrenArgs<
  FieldsType<SignatureItem>
>;

type Props = {
  field?: ArrayWrapperArgs[1][0];
  isValid?: boolean;
  file?: FileDefinition;
  name?: string;
  isLast?: boolean;
};

export const SignatureFormRow = ({
  values,
  className = "",
}: {
  values: Array<React.ReactNode>;
  className?: string;
}) => {
  return (
    <div
      className={`tw-grid tw-grid-cols-[16px_1fr_auto] tw-items-center tw-gap-2 tw-px-4 tw-py-2 ${className}`}
    >
      <div className="tw-flex tw-items-center tw-justify-center tw-h-10 tw-truncate tw-w-4">
        {values[0]}
      </div>
      <div className="tw-flex tw-items-center tw-h-10 tw-truncate">
        {values[1]}
      </div>
      <div className="tw-flex tw-items-center tw-justify-end tw-h-10">
        {values[2]}
      </div>
    </div>
  );
};

export const SignatureFormModal = ({
  field,
  file,
  isValid,
  name,
  isLast,
}: Props) => {
  const [open, setOpen] = useState(false);

  if (!field || !file) {
    return null;
  }

  return (
    <>
      <div
        className={`tw-border-b tw-border-gray-200 tw-bg-white ${
          isLast ? "tw-border-b-0" : ""
        }`}
      >
        <SignatureFormRow
          className="tw-py-2"
          values={[
            isValid ? (
              <Icon
                iconName="CheckMark"
                styles={{ root: { color: "green" } }}
              />
            ) : (
              <Icon iconName="Cancel" styles={{ root: { color: "red" } }} />
            ),
            <Text className="tw-font-medium">{name || file.name}</Text>,
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="tw-cursor-pointer hover:tw-opacity-70 tw-underline"
            >
              {!open && (isValid ? <>Změnit podpis</> : <>Nastavit podpis</>)}
              {open && <>Zavřít</>}
            </button>,
          ]}
        />

        {open && (
          <div className="tw-px-4 tw-pb-4">
            <SignatureSingleFileForm
              onLoad={(p) => console.log(p)}
              file={file}
              field={field}
            />
          </div>
        )}
      </div>
    </>
  );
};
