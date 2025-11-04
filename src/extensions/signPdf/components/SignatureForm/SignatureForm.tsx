import "@pnp/sp/webs";
import {
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  Icon,
  PrimaryButton,
  SelectionMode,
  Stack,
} from "office-ui-fabric-react";
import * as React from "react";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";
import { CheckboxField, FileField, useForm } from "../forms";
import { isValidSignatureField } from "../../utils/validations";
import { SignatureFormSchema } from "../../schemas/SignatureForm.schema";
import { SignatureFormModal } from "./SignatureFormModal";
import { SignatureFormInputType } from "./SignatureSingleFileForm";
import "./styles.css";
import useSignInit from "./useSignInit";
import strings from "SignPdfStrings";

export type SignatureFormData = {
  useForAll?: boolean;
  data: SignatureFormInputType[];
  signImageContent?: string;
};

const SignatureForm = (): React.ReactElement => {
  const { files, closeModal } = useScreenSetup();
  const { signDocuments } = useSignInit();
  const [showModal, setShowModal] = React.useState(false);
  const { FormProvider, superFields, values, form, formInvalid, handleSubmit } =
    useForm({
      name: "form",
      reValidateMode: "onChange",
      schema: SignatureFormSchema,
      fieldList: {
        useForAll: {
          label: strings.signatureFormUseForAllLabel,
          defaultValue: false,
        },
        signImageContent: {
          label: strings.signatureFormImageLabel,
        },
        data: [
          {
            reason: {
              label: strings.signatureFormReasonLabel,
            },
            location: {
              label: strings.signatureFormLocationLabel,
            },
            rect: {
              label: strings.signatureFormRectLabel,
            },
          },
        ],
      },
    });

  React.useEffect(() => {
    form.resetField("data");
  }, [values.useForAll]);

  const filesWithValidity = React.useMemo(() => {
    return (values.useForAll ? [files[0]] : files).map((f, key) => {
      const sign = values?.data?.[key];
      const isValidSign = isValidSignatureField(sign);
      return {
        ...f,
        name: values.useForAll ? strings.signatureFormAllDocuments : f.name,
        valid: isValidSign,
      };
    });
  }, [values, files]);

  return (
    <FormProvider>
      <h3>{strings.signatureFormTitle}</h3>
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <superFields.data.ArrayWrapper>
          {(hook, fields) => {
            return (
              <>
                <PrimaryButton
                  onClick={() => {
                    setShowModal(true);
                    if (hook.fields.length === 0) {
                      if (superFields.useForAll.getValue()) hook.append({});
                      else
                        files.forEach(() => {
                          hook.append({});
                        });
                    }
                  }}
                >
                  {strings.signatureFormSelectPosition}
                </PrimaryButton>
                <SignatureFormModal
                  fields={fields}
                  showModal={showModal}
                  toggleModal={setShowModal}
                  files={files}
                />
              </>
            );
          }}
        </superFields.data.ArrayWrapper>

        <FileField
          {...superFields.signImageContent}
          style={{ paddingLeft: 10, borderLeft: "1px solid black" }}
        />
      </Stack>
      <CheckboxField {...superFields.useForAll} />

      <DetailsList
        items={filesWithValidity}
        columns={[
          {
            key: "fileName",
            name: strings.selectedFilesLabel,
            fieldName: "name",
            minWidth: 300,
            maxWidth: 300,
            isResizable: false,
          },
          {
            key: "isValid",
            name: strings.validFilesLabel,
            fieldName: "valid",
            onRender: (item: (typeof filesWithValidity)[0]) =>
              item.valid ? (
                <Icon
                  iconName="CheckMark"
                  styles={{ root: { color: "green" } }}
                />
              ) : (
                <Icon iconName="Cancel" styles={{ root: { color: "red" } }} />
              ),
            minWidth: 300,
            maxWidth: 300,
            isResizable: false,
          },
        ]}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
      />
      <Stack
        horizontal
        tokens={{ childrenGap: 10 }}
        styles={{ root: { marginTop: 20 } }}
      >
        <PrimaryButton
          text={strings.continueButton}
          disabled={formInvalid || filesWithValidity.some((f) => !f.valid)}
          onClick={() =>
            handleSubmit((data) => {
              signDocuments(data.form);
            })
          }
        />
        <DefaultButton text={strings.cancelButton} onClick={closeModal} />
      </Stack>
    </FormProvider>
  );
};

export default SignatureForm;
