import "@pnp/sp/webs";
import React, { useEffect, useState } from "react";
import { useWebClient } from "../../context/webClient/webClient";
import { Rect, Size } from "../../types/dimensions";
import { FileDefinition } from "../../types/files";
import { InputField, PdfPreviewField } from "../forms";
import Grid from "../Grid/Grid";
import { ArrayWrapperArgs } from "./SignatureFormModal";
import Box from "../Box/Box";

export type SignatureFormInputType = {
  reason?: string;
  location?: string;
  rect?: Rect;
};

type Props = {
  onClose?: () => void;
  file: FileDefinition;
  onLoad: (pageDimension: Size) => void;
  field: ArrayWrapperArgs[1][0];
};

const SignatureSingleFileForm = ({
  file,
  field,
  onLoad,
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
          <InputField {...field.reason} />
          <InputField {...field.location} />
        </Grid>
      </Box>
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
