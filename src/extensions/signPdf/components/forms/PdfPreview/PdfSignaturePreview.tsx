import { PrimaryButton } from "office-ui-fabric-react";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import strings from "SignPdfStrings";
import { usePdfSignaturePreview } from "../../../hooks/usePdfSignaturePreview";
import { useSignRect } from "../../../hooks/useSignRect";
import { Rect } from "../../../types/dimensions";
import { FieldDefinition } from "../types";
import "./PdfPreview.css";
import { PdfSignaturePreviewProps } from "../../../types/pdfPreview";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export interface PdfSignaturePreviewComponentProps
  extends PdfSignaturePreviewProps {
  pageWidth?: number;
}

const PdfPreviewComponent: React.FC<PdfSignaturePreviewComponentProps> = ({
  pdfData,
  onChange,
  onLoad,
  value,
  pageWidth = 600,
}) => {
  const { state, setCurrentPage, paging, handlers } = usePdfSignaturePreview({
    value,
    onChange,
    onLoad,
  });

  const signatureField = useSignRect({
    pageDimension: state.pageDimension,
    renderedDimension: state.renderedDimension,
    currentPage: state.currentPage,
    value,
    onChange,
  });

  if (!pdfData) return null;

  return (
    <div className="pdf-signature-preview-wrapper">
      <PrimaryButton
        disabled={!paging.canPrev}
        onClick={() => setCurrentPage((p) => Math.max(1, (p || 1) - 1))}
      >
        {"<"}
      </PrimaryButton>

      <div className="pdf-preview-container">
        <Document
          file={pdfData}
          onLoadSuccess={handlers.onDocumentLoadSuccess}
          loading={<div>{strings.pdfPreviewLoading}</div>}
          renderMode="canvas"
        >
          <div key={`page_${state.currentPage}`} className="pdf-page-container">
            <Page
              pageNumber={state.currentPage}
              width={pageWidth}
              onLoadSuccess={(page) =>
                handlers.onPageLoadSuccess(page, state.currentPage)
              }
            />
            {signatureField.signatureFieldBox}
          </div>
        </Document>
      </div>

      <PrimaryButton
        disabled={!paging.canNext}
        onClick={() =>
          setCurrentPage((p) =>
            state.numPages ? Math.min((p || 1) + 1, state.numPages) : 1
          )
        }
      >
        {">"}
      </PrimaryButton>
    </div>
  );
};

export const PdfPreview = ({
  field,
  ...props
}: FieldDefinition<PdfSignaturePreviewProps, Partial<Rect> | undefined>) => {
  if (!props.pdfData || !props.onLoad) return null;
  return (
    <PdfPreviewComponent
      onChange={(rect) => {
        if (rect) {
          field?.onChange(rect);
          field?.onBlur();
        }
      }}
      value={field?.value}
      pdfData={props.pdfData}
      onLoad={props.onLoad}
    />
  );
};

export default PdfPreview;
