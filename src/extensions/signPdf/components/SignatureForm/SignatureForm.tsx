import "@pnp/sp/webs";
import { IChoiceGroupOption, List } from "office-ui-fabric-react";
import React, { useCallback, useEffect, useMemo } from "react";
import strings from "SignPdfStrings";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";
import { SignatureFormSchema } from "../../schemas/SignatureForm.schema";
import { FileDefinition } from "../../types/files";
import { isValidSignatureField } from "../../utils/validations";
import Box from "../Box/Box";
import ContentWrapper from "../ContentWrapper/ContentWrapper";
import Footer from "../Footer/Footer";
import {
  CheckboxField,
  FileField,
  RadioListField,
  SelectField,
  useForm,
} from "../forms";
import {
  ArrayWrapperArgs,
  SignatureFormModal,
  SignatureFormRow,
} from "./SignatureFormModal";
import SignatureSingleFileForm, {
  SignatureFormInputType,
} from "./SignatureSingleFileForm";
import "./styles.css";
import useSignInit from "./useSignInit";
import useSignature from "../../hooks/useSignature";

export type SignatureFormData = {
  useForAll?: boolean;
  data: SignatureFormInputType[];
  signImageContent?: string;
  imageSelector: "empty" | "upload" | "company" | "personal";
  useColumnAttachment?: boolean;
  columnAttachment?: string;
};

const SignatureForm = (): React.ReactElement => {
  const {
    files,
    closeModal,
    planInfo,
    attachmentColumns,
    setDetailPanelOpen,
    detailPanelOpen,
  } = useScreenSetup();
  const { signDocuments } = useSignInit();
  const { publicKey } = useSignature();
  const [showNextOptions, setShowNextOptions] = React.useState(
    publicKey ? false : true
  );
  const { FormProvider, superFields, values, form, formInvalid, handleSubmit } =
    useForm({
      name: "form",
      reValidateMode: "onChange",
      schema: SignatureFormSchema,
      defaultValues: {
        data: files.map(() => ({})),
        useColumnAttachment: false,
      },
      fieldList: {
        useForAll: {
          label: publicKey
            ? strings.signatureFormUseForAllLabel
            : strings.signatureFormUseForAllLabelNoPublicKey,
          defaultValue: false,
        },
        useColumnAttachment: {
          label: strings.signatureFormUseAttachmentFromRow,
          defaultValue: false,
        },
        columnAttachment: {
          label: strings.signatureFormAttachmentColumnLabel,
        },
        imageSelector: {
          label: "Signature graphic",
          defaultValue: "empty",
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
            attachmentFile: {
              label: strings.attachmentUploadLabel,
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
        files.map(
          () =>
            ({
              reason: planInfo?.defaultReason || "",
              location: planInfo?.defaultLocation || "",
            } as any)
        )
      );
    }
  }, [values.useForAll]);

  const attachmentOptions = useMemo(
    () =>
      (attachmentColumns || []).map((c) => ({
        value: c.internalName,
        label: c.displayName,
      })),
    [attachmentColumns]
  );

  useEffect(() => {
    if (!values.useColumnAttachment) {
      form.setValue("columnAttachment", undefined as any);
      return;
    }

    if (!attachmentOptions.length) {
      form.setValue("columnAttachment", undefined as any);
      return;
    }

    if (
      values.useColumnAttachment &&
      attachmentOptions.length === 1 &&
      attachmentOptions[0]?.value
    ) {
      form.setValue("columnAttachment", attachmentOptions[0].value as any);
    }
  }, [attachmentOptions, form, values.useColumnAttachment]);

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

  const selectedAttachmentColumn = useMemo(
    () =>
      attachmentColumns?.find(
        (column) => column.internalName === values.columnAttachment
      ),
    [attachmentColumns, values.columnAttachment]
  );

  const [selectedDetail, setSelectedDetail] = React.useState<{
    field: ArrayWrapperArgs[1][0];
    file: FileDefinition;
    index: number;
  } | null>(null);

  const closeDetail = useCallback(
    (closePanel = true) => {
      setSelectedDetail(null);
      setDetailPanelOpen?.(!closePanel);
    },
    [setDetailPanelOpen]
  );

  const openDetail = useCallback(
    (payload: {
      field: ArrayWrapperArgs[1][0];
      file: FileDefinition;
      index: number;
    }) => {
      if (selectedDetail) {
        closeDetail(false);
      }
      setTimeout(() => {
        setSelectedDetail(payload);
        setDetailPanelOpen?.(true);
      }, 100);
    },
    [setDetailPanelOpen, selectedDetail]
  );

  useEffect(() => {
    closeDetail();
  }, [values.useForAll, closeDetail]);

  useEffect(() => {
    if (!selectedDetail) {
      setDetailPanelOpen?.(false);
    }
  }, [selectedDetail, setDetailPanelOpen]);

  useEffect(() => {
    return () => {
      setDetailPanelOpen?.(false);
    };
  }, [setDetailPanelOpen]);

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
        <div
          className={`tw-flex tw-gap-4 ${
            detailPanelOpen ? "tw-flex-row" : "tw-flex-col"
          }`}
        >
          <div className={detailPanelOpen ? "tw-w-1/2" : "tw-w-full"}>
            <Box
              background="gray"
              className="tw-flex tw-justify-center tw-flex-col tw-gap-4"
            >
              <CheckboxField {...superFields.useForAll} />
              <button
                onClick={() => setShowNextOptions((c) => !c)}
                className="tw-text-blue-600 dark:tw-text-blue-500 hover:tw-underline tw-inline tw-max-w-max"
              >
                {showNextOptions ? "Hide next options" : "Show next options"}
              </button>
              {showNextOptions && (
                <>
                  <RadioListField
                    {...superFields.imageSelector}
                    options={
                      [
                        {
                          text: "None",
                          key: "empty",
                          imageSize: { width: 32, height: 32 },
                          iconProps: { iconName: "Clear" },
                        },
                        {
                          text: "Upload a graphic",
                          key: "upload",
                          imageSize: { width: 32, height: 32 },
                          iconProps: values.signImageContent
                            ? undefined
                            : { iconName: "Add" },
                          imageSrc: values.signImageContent ?? undefined,
                        },
                        planInfo?.companyImageSignature && {
                          text: "Company graphic",
                          key: "company",
                          imageSize: { width: 32, height: 32 },
                          imageSrc: planInfo?.companyImageSignature,
                        },
                        planInfo?.userImageSignature && {
                          text: "Personal graphic",
                          key: "personal",
                          imageSize: { width: 32, height: 32 },
                          imageSrc: planInfo?.userImageSignature,
                        },
                      ].filter((x) => !!x) as IChoiceGroupOption[]
                    }
                  />
                  {values.imageSelector === "upload" && (
                    <FileField {...superFields.signImageContent} hidePreview />
                  )}
                </>
              )}
            </Box>

            <Box background="white" className="tw-flex tw-flex-col tw-gap-3">
              <CheckboxField
                {...superFields.useColumnAttachment}
                isDisabled={!attachmentOptions.length}
              />
              {values.useColumnAttachment && (
                <>
                  <SelectField
                    {...superFields.columnAttachment}
                    placeholder={
                      strings.signatureFormAttachmentColumnPlaceholder
                    }
                    values={attachmentOptions}
                    isDisabled={!attachmentOptions.length}
                  />
                  {values.useColumnAttachment && !attachmentOptions.length && (
                    <p className="tw-text-sm tw-text-gray-600 tw-m-0">
                      {strings.signatureFormAttachmentColumnMissing}
                    </p>
                  )}
                </>
              )}
              {!attachmentOptions.length && !values.useColumnAttachment && (
                <p className="tw-text-sm tw-text-gray-600 tw-m-0">
                  {strings.signatureFormAttachmentColumnMissing}
                </p>
              )}
            </Box>

            <superFields.data.ArrayWrapper>
              {(hook, fields) => {
                return (
                  <Box className="tw-max-h-80 tw-overflow-y-auto">
                    <SignatureFormRow
                      values={[
                        <div />,
                        <>File name</>,
                        <>Signature settings</>,
                      ]}
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
                              typeof index === "number"
                                ? values.useForAll
                                  ? files[0]
                                  : files[index]
                                : undefined
                            }
                            onOpen={() => {
                              if (typeof index !== "number") return;
                              const targetFile = values.useForAll
                                ? files[0]
                                : files[index];
                              openDetail({
                                field: field as any,
                                file: targetFile,
                                index: index as number,
                              });
                            }}
                          />
                        );
                      }}
                    />
                  </Box>
                );
              }}
            </superFields.data.ArrayWrapper>
          </div>

          {selectedDetail && (
            <div className="tw-w-1/2 tw-bg-white tw-rounded-md tw-border tw-border-gray-200 tw-shadow-sm tw-p-4 tw-flex tw-flex-col tw-gap-4">
              <div className="tw-flex tw-items-start tw-justify-between tw-gap-3">
                <div>
                  <p className="tw-text-base tw-font-semibold tw-m-0">
                    {selectedDetail.file.name}
                  </p>
                  {values.useColumnAttachment && selectedAttachmentColumn && (
                    <p className="tw-text-xs tw-text-gray-600 tw-m-0">
                      Using attachment from column:{" "}
                      {selectedAttachmentColumn.displayName}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeDetail}
                  className="tw-text-blue-600 hover:tw-underline"
                >
                  Close detail
                </button>
              </div>

              <div className="tw-overflow-y-auto tw-max-h-[70vh]">
                <SignatureSingleFileForm
                  onLoad={(p) => console.log(p)}
                  file={selectedDetail.file}
                  field={selectedDetail.field}
                  // todo: improve typings
                  // hideAttachment={!!values.useForAll}
                  hideAttachment
                  useColumnAttachment={
                    !!values.useColumnAttachment && !!values.columnAttachment
                  }
                  columnAttachmentLabel={selectedAttachmentColumn?.displayName}
                />
              </div>
            </div>
          )}
        </div>
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
