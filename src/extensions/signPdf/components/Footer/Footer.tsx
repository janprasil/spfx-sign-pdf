import React from "react";

type Button = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
};

type Props = {
  next?: Button;
  back?: Button;
};

const Footer = ({ next, back }: Props) => {
  return (
    <div className="tw-flex tw-items-center tw-justify-between tw-border-t tw-border-[rgb(225,223,221)] tw-bg-[rgb(250,249,248)] tw-p-6">
      {back ? (
        <button
          onClick={back?.onClick}
          disabled={back?.disabled}
          className="tw-rounded-sm tw-border tw-border-[rgb(225,223,221)] tw-bg-white tw-px-5 tw-py-2 tw-font-medium tw-text-[rgb(50,49,48)] tw-text-sm tw-transition-colors hover:tw-bg-[rgb(243,242,241)] disabled:tw-cursor-not-allowed disabled:tw-opacity-50"
        >
          {back?.text}
        </button>
      ) : (
        <div />
      )}
      {next && (
        <button
          onClick={next?.onClick}
          disabled={next?.disabled}
          className="tw-rounded-sm tw-bg-[rgb(0,120,212)] tw-px-5 tw-py-2 tw-font-medium tw-text-sm tw-text-white tw-transition-colors hover:tw-bg-[rgb(16,110,190)] disabled:tw-cursor-not-allowed disabled:tw-bg-[rgb(200,198,196)] disabled:tw-text-[rgb(161,159,157)]"
        >
          {next?.text}
        </button>
      )}
    </div>
  );
};

export default Footer;
