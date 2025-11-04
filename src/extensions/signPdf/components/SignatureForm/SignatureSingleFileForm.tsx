import "@pnp/sp/webs";
import * as React from "react";
import strings from "SignPdfStrings";
import { useWebClient } from "../../context/webClient/webClient";
import { FileDefinition } from "../../types/files";
import { Rect, Size } from "../../types/dimensions";
import { InputField, PdfPreviewField } from "../forms";
import { ArrayWrapperArgs } from "./SignatureFormModal";

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
  const [pdfData, setPdfData] = React.useState<ArrayBuffer>();

  React.useEffect(() => {
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
    <div style={{ display: "flex", flexFlow: "column" }}>
      <h3>{strings.signatureSingleTitle}</h3>
      <InputField {...field.reason} />
      <InputField {...field.location} />

      <p style={{ marginTop: 10, marginBottom: 10 }}>
        {strings.signaturePlacementHint}
      </p>
      {pdfData && (
        <PdfPreviewField
          pdfData={pdfData}
          onLoad={onLoad}
          defaultValue={field.rect.defaultValue as Partial<Rect> | undefined}
          {...field.rect}
        />
      )}
    </div>
  );
};

export default SignatureSingleFileForm;
