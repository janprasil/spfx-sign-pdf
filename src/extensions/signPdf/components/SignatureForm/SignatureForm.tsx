import "@pnp/sp/webs";
import { List } from "office-ui-fabric-react";
import React, { useCallback, useEffect, useMemo } from "react";
import strings from "SignPdfStrings";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";
import { SignatureFormSchema } from "../../schemas/SignatureForm.schema";
import { isValidSignatureField } from "../../utils/validations";
import Box from "../Box/Box";
import ContentWrapper from "../ContentWrapper/ContentWrapper";
import Footer from "../Footer/Footer";
import { CheckboxField, FileField, useForm } from "../forms";
import { SignatureFormModal, SignatureFormRow } from "./SignatureFormModal";
import { SignatureFormInputType } from "./SignatureSingleFileForm";
import "./styles.css";
import useSignInit from "./useSignInit";
import Grid from "../Grid/Grid";

export type SignatureFormData = {
  useForAll?: boolean;
  data: SignatureFormInputType[];
  signImageContent?: string;
};

const SignatureForm = (): React.ReactElement => {
  const { files, closeModal } = useScreenSetup();
  const { signDocuments } = useSignInit();
  const { FormProvider, superFields, values, form, formInvalid, handleSubmit } =
    useForm({
      name: "form",
      reValidateMode: "onChange",
      schema: SignatureFormSchema,
      defaultValues: {
        data: files.map(() => ({})),
      },
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
              placeholder: strings.signatureFormReasonLabel,
            },
            location: {
              placeholder: strings.signatureFormLocationLabel,
            },
            rect: {
              label: strings.signatureFormRectLabel,
            },
          },
        ],
      },
    });

  useEffect(() => {
    form.resetField("data");
    if (values.useForAll) {
      form.setValue("data", [{} as any]);
    } else {
      form.setValue(
        "data",
        files.map(() => ({} as any))
      );
    }
  }, [values.useForAll]);

  const filesWithValidity = useMemo(() => {
    return (values.useForAll ? [files[0]] : files).map((f, key) => {
      const sign = values?.data?.[key];
      const isValidSign = isValidSignatureField(sign);
      return {
        ...f,
        name: values.useForAll ? strings.signatureFormAllDocuments : f.name,
        valid: Boolean(isValidSign),
      };
    });
  }, [values, files]);

  const getFieldsForRendering = useCallback(
    (fields: any) => {
      if (values.useForAll) {
        const isValid = filesWithValidity[0]?.valid;
        return [
          {
            ...fields[0],
            name: filesWithValidity[0]?.name,
            isValid,
          },
        ];
      }
      return fields.map((field: any, index: number) => {
        const isValid = filesWithValidity[index]?.valid;
        return {
          ...field,
          isValid,
        };
      });
    },
    [values.useForAll, filesWithValidity]
  );

  return (
    <FormProvider>
      <ContentWrapper>
        <Grid cols={2} gap={4}>
          <Box background="gray">
            <CheckboxField {...superFields.useForAll} />
          </Box>
          <Box background="gray">
            <FileField {...superFields.signImageContent} />
          </Box>
        </Grid>

        <superFields.data.ArrayWrapper>
          {(hook, fields) => {
            return (
              <Box>
                <SignatureFormRow
                  values={[<div />, <>Název souboru</>, <>Nastavení podpisu</>]}
                />
                <List
                  items={getFieldsForRendering(fields)}
                  onRenderCell={(field, index) => {
                    return (
                      <SignatureFormModal
                        field={field as any}
                        isValid={field?.isValid}
                        key={"field_" + index}
                        isLast={index === fields.length - 1}
                        name={field?.name}
                        file={
                          typeof index === "number" ? files[index] : undefined
                        }
                      />
                    );
                  }}
                />
              </Box>
            );
          }}
        </superFields.data.ArrayWrapper>
      </ContentWrapper>
      <Footer
        next={{
          text: strings.continueButton,
          disabled: formInvalid || filesWithValidity.some((f) => !f.valid),
          onClick: () =>
            handleSubmit((data) => {
              signDocuments(data.form);
            }),
        }}
        back={{
          text: strings.cancelButton,
          onClick: closeModal,
        }}
      />
    </FormProvider>
  );
};

export default SignatureForm;
