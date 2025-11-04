import * as React from "react";
import { useMemo } from "react";
import { useDragResize } from "./useDraggableBox";
import {
  Position,
  PositionWithSize,
  Size,
  ResizeDirection,
} from "../../types/dimensions";
import "./style.css";

interface ResizableDraggableBoxProps {
  parentRef: React.RefObject<HTMLDivElement>;
  onChange: (size: Size, position: Position) => void;
  defaultSize?: PositionWithSize;
}

const ResizableDraggableBox: React.FC<ResizableDraggableBoxProps> = React.memo(
  ({
    parentRef,
    onChange,
    defaultSize = { x: 100, y: 100, width: 200, height: 150 },
  }) => {
    const { style, onDragMouseDown, onResizeMouseDown } = useDragResize({
      parentRef,
      defaultRect: defaultSize,
      onStableChange: (s, p) => onChange(s, p),
    });

    const handles = useMemo(
      () =>
        [
          "top-left",
          "top",
          "top-right",
          "right",
          "bottom-right",
          "bottom",
          "bottom-left",
          "left",
        ] as ResizeDirection[],
      []
    );

    return (
      <div
        className="draggable-box"
        style={style}
        onMouseDown={onDragMouseDown}
      >
        {handles.map((h) => (
          <div
            key={h}
            className={`resize-handle ${h}`}
            onMouseDown={onResizeMouseDown(h)}
          />
        ))}
      </div>
    );
  }
);

export default ResizableDraggableBox;
