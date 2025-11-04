import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Position,
  PositionWithSize,
  ResizeDirection,
  Size,
} from "../../types/dimensions";

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(v, max));
const MIN_W = 20;
const MIN_H = 20;

interface UseDragResizeArgs {
  parentRef: React.RefObject<HTMLElement>;
  defaultRect: PositionWithSize;
  onStableChange?: (size: Size, position: Position) => void;
}

export function useDragResize({
  parentRef,
  defaultRect,
  onStableChange,
}: UseDragResizeArgs) {
  const [pos, setPos] = useState<Position>({
    x: defaultRect.x,
    y: defaultRect.y,
  });
  const [size, setSize] = useState<Size>({
    width: defaultRect.width,
    height: defaultRect.height,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dir, setDir] = useState<ResizeDirection | undefined>();

  const mouseStart = useRef<Position>({ x: 0, y: 0 });
  const rectStart = useRef<PositionWithSize>(defaultRect);
  const frame = useRef<number | null>(null);

  const getBounds = useCallback(() => {
    const p = parentRef.current;
    if (p) {
      const r = p.getBoundingClientRect();
      return { left: 0, top: 0, right: r.width, bottom: r.height };
    }
    return {
      left: 0,
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
    };
  }, [parentRef]);

  useEffect(() => {
    if (!isDragging && !isResizing && onStableChange) onStableChange(size, pos);
  }, [isDragging, isResizing, size, pos, onStableChange]);

  const onDragMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      mouseStart.current = { x: e.clientX, y: e.clientY };
      rectStart.current = {
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
      };
    },
    [pos.x, pos.y, size.width, size.height]
  );

  const onResizeMouseDown = useCallback(
    (direction: ResizeDirection) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setDir(direction);
      mouseStart.current = { x: e.clientX, y: e.clientY };
      rectStart.current = {
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
      };
    },
    [pos.x, pos.y, size.width, size.height]
  );

  useEffect(() => {
    const parent = parentRef.current ?? document.body;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging && !isResizing) return;
      const run = () => {
        const bounds = getBounds();
        const dx = e.clientX - mouseStart.current.x;
        const dy = e.clientY - mouseStart.current.y;

        if (isDragging) {
          let newX = rectStart.current.x + dx;
          let newY = rectStart.current.y + dy;
          newX = clamp(newX, bounds.left, bounds.right - size.width);
          newY = clamp(newY, bounds.top, bounds.bottom - size.height);
          setPos({ x: newX, y: newY });
          return;
        }

        if (isResizing && dir) {
          let newW = rectStart.current.width;
          let newH = rectStart.current.height;
          let newX = rectStart.current.x;
          let newY = rectStart.current.y;

          if (dir.includes("right"))
            newW = clamp(
              rectStart.current.width + dx,
              MIN_W,
              bounds.right - rectStart.current.x
            );
          if (dir.includes("left")) {
            newW = rectStart.current.width - dx;
            newX = rectStart.current.x + dx;
            if (newX < bounds.left) {
              newW += newX - bounds.left;
              newX = bounds.left;
            }
            newW = Math.max(newW, MIN_W);
          }
          if (dir.includes("bottom"))
            newH = clamp(
              rectStart.current.height + dy,
              MIN_H,
              bounds.bottom - rectStart.current.y
            );
          if (dir.includes("top")) {
            newH = rectStart.current.height - dy;
            newY = rectStart.current.y + dy;
            if (newY < bounds.top) {
              newH += newY - bounds.top;
              newY = bounds.top;
            }
            newH = Math.max(newH, MIN_H);
          }

          setSize({ width: newW, height: newH });
          setPos({ x: newX, y: newY });
        }
      };

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(run);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setDir(undefined);
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseup", handleMouseUp);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseup", handleMouseUp);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [
    parentRef,
    getBounds,
    isDragging,
    isResizing,
    dir,
    size.width,
    size.height,
  ]);

  const style = useMemo<React.CSSProperties>(
    () => ({
      width: size.width,
      height: size.height,
      transform: `translate(${pos.x}px, ${pos.y}px)`,
      position: "absolute",
      border: "2px solid #3498db",
      backgroundColor: "#ecf0f1",
      boxSizing: "border-box",
      cursor: isDragging ? "grabbing" : "grab",
    }),
    [pos.x, pos.y, size.width, size.height, isDragging]
  );

  return { pos, size, style, onDragMouseDown, onResizeMouseDown } as const;
}
