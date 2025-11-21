import React from "react";

type Props = {
  title?: string;
  children: React.ReactNode;
  background?: "gray" | "white";
  className?: string;
};

const backgroundClasses = {
  gray: "tw-bg-[rgb(250,250,250)]",
  white: "tw-bg-white",
};

const Box = ({ title, children, background = "white", className }: Props) => {
  return (
    <div
      className={`tw-rounded-sm tw-border tw-border-[rgb(225,223,221)] ${backgroundClasses[background]} tw-p-4 tw-my-4 ${className}`}
    >
      {title && (
        <h4 className="tw-mb-4 tw-font-semibold tw-text-[rgb(32,31,30)] tw-text-sm">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
};

export default Box;
