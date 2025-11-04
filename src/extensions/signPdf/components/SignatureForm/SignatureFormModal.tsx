import "@pnp/sp/webs";
import { Modal, PrimaryButton, Text } from "office-ui-fabric-react";
import * as React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { ArrayWrapperChildrenArgs, FieldsType } from "../forms/useForm";
import { FileDefinition } from "../../types/files";
import { SignatureFormSchema } from "../../schemas/SignatureForm.schema";
import SignatureSingleFileForm from "./SignatureSingleFileForm";
import strings from "SignPdfStrings";

export type SignatureItem = (typeof SignatureFormSchema._type.data)[0];
export type ArrayWrapperArgs = ArrayWrapperChildrenArgs<
  FieldsType<SignatureItem>
>;

type Props = {
  fields: ArrayWrapperArgs[1];
  showModal: boolean;
  toggleModal: (show: boolean) => void;
  files: FileDefinition[];
};

type SignatureModalHeaderButtonType = {
  disabled: boolean;
  onClick: () => void;
};

type SignatureModalHeaderProps = {
  buttons: {
    next: SignatureModalHeaderButtonType;
    previous: SignatureModalHeaderButtonType;
  };
  title: string;
  onClose: () => void;
};

export const SignatureModalHeader = ({
  buttons: { next, previous },
  title,
  onClose,
}: SignatureModalHeaderProps) => {
  return (
    <div className="signature-form-modal-wrapper">
      <PrimaryButton disabled={previous.disabled} onClick={previous.onClick}>
        {strings.signatureModalPrevious}
      </PrimaryButton>
      <Text>{title}</Text>
      <div className="signature-form-modal-buttons-wrapper">
        <PrimaryButton disabled={next.disabled} onClick={next.onClick}>
          {strings.signatureModalNext}
        </PrimaryButton>
        <PrimaryButton onClick={onClose}>
          {strings.signatureModalClose}
        </PrimaryButton>
      </div>
    </div>
  );
};

export const SignatureFormModal = ({
  fields,
  showModal,
  toggleModal,
  files,
}: Props) => {
  const { watch } = useFormContext<z.TypeOf<typeof SignatureFormSchema>>();
  const [currentDocument, setCurrentDocument] = React.useState(0);
  const [modalWidth, setModalWidth] = React.useState(500);
  const values = watch();

  return (
    <Modal
      isOpen={showModal}
      onDismiss={() => toggleModal(false)}
      styles={{
        main: {
          minWidth: `${modalWidth}px`,
          padding: 20,
          overflow: "hidden",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          flexFlow: "column",
        }}
      >
        <SignatureModalHeader
          buttons={{
            next: {
              disabled: currentDocument === files.length - 1,
              onClick: () =>
                setCurrentDocument((document) =>
                  Math.min(document + 1, files.length - 1)
                ),
            },
            previous: {
              disabled: currentDocument === 0,
              onClick: () =>
                setCurrentDocument((document) => Math.max(document - 1, 0)),
            },
          }}
          onClose={() => toggleModal(false)}
          title={`${strings.signatureModalFileTitlePrefix} ${files[currentDocument].name}`}
        />

        <div>
          <SignatureSingleFileForm
            onLoad={(p) => setModalWidth(Math.min(p.width, 800))}
            file={files[currentDocument]}
            field={fields[values.useForAll ? 0 : currentDocument]}
            key={`document_${currentDocument}`}
          />
        </div>
      </div>
    </Modal>
  );
};
