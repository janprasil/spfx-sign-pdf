import { Size, Rect } from "./dimensions";

export interface PdfSignaturePreviewProps {
  pdfData: ArrayBuffer;
  onChange: (rect: Rect | undefined) => void;
  onLoad: (p: Size) => void;
  value: Rect | undefined;
}
