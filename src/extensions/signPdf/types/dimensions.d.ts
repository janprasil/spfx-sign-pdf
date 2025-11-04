export type Position = {
  x: number;
  y: number;
};

export interface Size {
  width: number;
  height: number;
}

export type PositionWithSize = Position & Size;

export type Rect = {
  page: number;
  xRatio?: number;
  yRatio?: number;
  pageHeight?: number;
} & PositionWithSize;

export type ResizeDirection =
  | "top-left"
  | "top"
  | "top-right"
  | "right"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "left";

export type Bounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};
