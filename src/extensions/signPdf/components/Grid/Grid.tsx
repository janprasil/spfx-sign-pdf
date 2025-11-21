import React from "react";

type Props = {
  children: React.ReactNode;
  cols?: number | Array<number>;
  gap?: number;
  className?: string;
};

const Grid = ({ cols = 1, gap, children, className }: Props) => {
  return (
    <div
      className={`tw-grid ${className} ${gap ? `tw-gap-${gap}` : ""}`}
      style={{
        gridTemplateColumns:
          typeof cols === "number"
            ? `repeat(${cols}, 1fr)`
            : cols.map((c) => `${c}fr`).join(" "),
      }}
    >
      {children}
    </div>
  );
};

export default Grid;
