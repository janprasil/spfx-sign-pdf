import { PropsWithChildren } from "react";
import React from "react";

type Props = {
  title?: string;
  description?: string;
};

const ContentWrapper = ({
  children,
  title,
  description,
}: PropsWithChildren<Props>) => {
  return (
    <div className="tw-flex-1 tw-overflow-y-auto tw-bg-white tw-p-6">
      {(title || description) && (
        <div>
          {title && (
            <h3 className="mb-2 font-semibold text-lg text-[rgb(32,31,30)]">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-[rgb(96,94,92)] text-sm leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default ContentWrapper;
