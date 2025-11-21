import "@pnp/sp/webs";
import React, { useEffect, useState } from "react";
import strings from "SignPdfStrings";
import { useWebClient } from "../../context/webClient/webClient";
import { Rect, Size } from "../../types/dimensions";
import { FileDefinition } from "../../types/files";
import { AttachmentField, InputField, PdfPreviewField } from "../forms";
import Grid from "../Grid/Grid";
import { ArrayWrapperArgs } from "./SignatureFormModal";
import Box from "../Box/Box";
import { UploadedAttachment } from "../../types/attachments";

export type SignatureFormInputType = {
  reason?: string;
  location?: string;
  rect?: Rect;
  attachmentFile?: UploadedAttachment;
};

type Props = {
  onClose?: () => void;
  file: FileDefinition;
  onLoad: (pageDimension: Size) => void;
  field: ArrayWrapperArgs[1][0];
  hideAttachment?: boolean;
  useColumnAttachment?: boolean;
  columnAttachmentLabel?: string;
};

const SignatureSingleFileForm = ({
  file,
  field,
  onLoad,
  hideAttachment,
  useColumnAttachment,
  columnAttachmentLabel,
}: Props): React.ReactElement => {
  const { httpClient } = useWebClient();
  const [pdfData, setPdfData] = useState<ArrayBuffer>();

  useEffect(() => {
    httpClient
      .getFileFromSharepoint(file.url)
      .then((file) => {
        setPdfData(file);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }, []);

  return (
    <>
      <Box>
        <Grid cols={2} gap={4}>
          <InputField {...(field.reason as any)} />
          <InputField {...(field.location as any)} />
        </Grid>
      </Box>
      {!hideAttachment && (
        <Box>
          <AttachmentField
            {...(field.attachmentFile as any)}
            helperText={
              useColumnAttachment
                ? strings.attachmentOverrideInfo
                : strings.attachmentOptionalInfo
            }
          />
        </Box>
      )}
      <div>
        {pdfData && (
          <PdfPreviewField
            pdfData={pdfData}
            onLoad={onLoad}
            defaultValue={field.rect.defaultValue as Partial<Rect> | undefined}
            {...field.rect}
          />
        )}
      </div>
    </>
  );
};

export default SignatureSingleFileForm;
