import * as React from "react";
import ResizableDraggableBox from "../components/DraggableBox/DraggableBox";
import { Position, Rect, Size } from "../types/dimensions";

const calculateRatio = (
  renderedDimension: Size | undefined,
  pageDimension: Size | undefined,
  dimension: "width" | "height"
) => {
  console.log(renderedDimension, pageDimension);
  return renderedDimension && pageDimension
    ? pageDimension[dimension] / renderedDimension[dimension]
    : 1;
};

const createRect = (
  position: Position,
  size: Size,
  page: number,
  renderedDimension: Size | undefined,
  pageDimension: Size | undefined
): Rect => {
  return {
    x: position.x,
    y: position.y,
    width: size.width,
    height: size.height,
    page,
    xRatio: calculateRatio(renderedDimension, pageDimension, "width"),
    yRatio: calculateRatio(renderedDimension, pageDimension, "height"),
    pageHeight: pageDimension?.height,
  };
};

export const useSignRect = ({
  renderedDimension,
  pageDimension,
  currentPage,
  value,
  onChange,
}: {
  renderedDimension?: Size;
  pageDimension?: Size;
  currentPage: number;
  value?: Rect;
  onChange: (rect: Rect | undefined) => void;
}) => {
  const parentRef = React.createRef<HTMLDivElement>();
  const handleFieldChange = (size: Size, position: Position) => {
    console.log(renderedDimension, pageDimension, currentPage);
    if (pageDimension && renderedDimension && currentPage) {
      const rect = createRect(
        position,
        size,
        currentPage,
        renderedDimension,
        pageDimension
      );

      if (rect) onChange(rect);
    }
  };

  const signatureFieldBox = React.useMemo(() => {
    return (
      <div className="sign-rect-wrapper" ref={parentRef}>
        <ResizableDraggableBox
          parentRef={parentRef}
          onChange={handleFieldChange}
          defaultSize={value || undefined}
        />
      </div>
    );
  }, [renderedDimension, pageDimension, currentPage]);

  return {
    signatureFieldBox,
  };
};
