import { useCallback, useEffect, useMemo, useState } from "react";
import type { PageCallback } from "react-pdf/dist/cjs/shared/types";
import type { Rect, Size } from "../types/dimensions";
import { PdfSignaturePreviewProps } from "../types/pdfPreview";

export interface UsePdfSignatureArgs {
  value: PdfSignaturePreviewProps["value"];
  onChange: (rect: Partial<Rect> | undefined) => void;
  onLoad: (page: PageCallback) => void;
}

export function usePdfSignaturePreview({
  value,
  onChange,
  onLoad,
}: UsePdfSignatureArgs) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>();
  const [pageDimensions, setPageDimensions] = useState<Record<number, Size>>(
    {}
  );
  const [renderedDimensions, setRenderedDimensions] = useState<
    Record<number, Size>
  >({});

  useEffect(() => {
    if (value?.page) setCurrentPage(value?.page);
  }, []);

  const pageDimension = pageDimensions[currentPage];
  const renderedDimension = renderedDimensions[currentPage];

  const onPageLoadSuccess = useCallback(
    (page: PageCallback, pageNumber: number) => {
      setPageDimensions((prev) => ({
        ...prev,
        [pageNumber]: {
          width: page.originalWidth,
          height: page.originalHeight,
        },
      }));
      setRenderedDimensions((prev) => ({
        ...prev,
        [pageNumber]: { width: page.width, height: page.height },
      }));
      onLoad(page);
    },
    [onLoad]
  );

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    []
  );

  const canPrev = useMemo(() => currentPage > 1, [currentPage]);
  const canNext = useMemo(
    () => !!numPages && currentPage < (numPages ?? 0),
    [currentPage, numPages]
  );

  useEffect(() => {
    onChange({ ...value, page: currentPage });
  }, [currentPage]);

  return {
    state: { currentPage, numPages, pageDimension, renderedDimension },
    setCurrentPage,
    paging: { canPrev, canNext },
    handlers: { onDocumentLoadSuccess, onPageLoadSuccess },
  } as const;
}
