import { Icon } from "office-ui-fabric-react";
import React, { useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import strings from "SignPdfStrings";
import { usePdfSignaturePreview } from "../../../hooks/usePdfSignaturePreview";
import { useSignRect } from "../../../hooks/useSignRect";
import { Rect } from "../../../types/dimensions";
import { PdfSignaturePreviewProps } from "../../../types/pdfPreview";
import { FieldDefinition } from "../types";
import "./PdfPreview.css";

const MAX_WIDTH = 400;

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const PdfPreviewComponent: React.FC<PdfSignaturePreviewProps> = ({
  pdfData,
  onChange,
  onLoad,
  value,
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
  const [shownDocumentWidth, setShownDocumentWidth] = React.useState<number>();
  const emptyPdfRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      const w = emptyPdfRef.current?.clientWidth;
      if (w) {
        setShownDocumentWidth(emptyPdfRef.current?.clientWidth);
      }
    }, 200);
  }, []);

  const finalWidth = useMemo(() => {
    return state.pageDimension?.width > state.pageDimension?.height
      ? shownDocumentWidth
      : Math.min(shownDocumentWidth || MAX_WIDTH, MAX_WIDTH);
  }, [shownDocumentWidth, state.pageDimension]);

  if (!pdfData) return null;

  const hasMultiplePages = paging.canNext || paging.canPrev;

  return (
    <div className="pdf-signature-preview-wrapper">
      {hasMultiplePages && (
        <button
          type="button"
          disabled={!paging.canPrev}
          onClick={() => setCurrentPage((p) => Math.max(1, (p || 1) - 1))}
          className={`tw-flex tw-items-center tw-justify-end tw-h-10 tw-p-2 tw-m-2 tw-rounded
          ${
            paging.canPrev
              ? "tw-bg-gray-700 tw-cursor-pointer hover:tw-opacity-70"
              : "tw-bg-gray-300"
          }
        `}
        >
          <Icon iconName="ChevronLeft" style={{ color: "white" }} />
        </button>
      )}

      <div className="tw-w-full tw-text-center" ref={emptyPdfRef}>
        <Document
          file={shownDocumentWidth ? pdfData : undefined}
          onLoadSuccess={handlers.onDocumentLoadSuccess}
          loading={<div>{strings.pdfPreviewLoading}</div>}
          noData={
            shownDocumentWidth ? (
              <div>Document is loading</div>
            ) : (
              <div>Nebyl nalezen žádný dokument</div>
            )
          }
          renderMode="canvas"
          className="tw-flex tw-justify-center"
        >
          <div
            key={`page_${state.currentPage}`}
            className="pdf-page-container tw-overflow-hidden tw-relative tw-rounded-md tw-border-[0.15rem] tw-border-dashed tw-border-gray-600 tw-bg-slate-50 tw-max-w-fit"
          >
            <Page
              pageNumber={state.currentPage}
              width={finalWidth}
              onLoadSuccess={(page) =>
                handlers.onPageLoadSuccess(page, state.currentPage)
              }
              className={state.pageDimension ? "" : "tw-hidden"}
            />
            {signatureField.signatureFieldBox}
          </div>
        </Document>
      </div>
      {hasMultiplePages && (
        <button
          type="button"
          disabled={!paging.canNext}
          onClick={() =>
            setCurrentPage((p) =>
              state.numPages ? Math.min((p || 1) + 1, state.numPages) : 1
            )
          }
          className={`tw-flex tw-items-center tw-justify-end tw-h-10 tw-p-2 tw-m-2 tw-rounded
          ${
            paging.canNext
              ? "tw-bg-gray-700 tw-cursor-pointer hover:tw-opacity-70"
              : "tw-bg-gray-300"
          }
        `}
        >
          <Icon iconName="ChevronRight" style={{ color: "white" }} />
        </button>
      )}
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
