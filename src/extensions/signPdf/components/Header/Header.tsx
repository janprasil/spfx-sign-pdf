import { IconButton } from "office-ui-fabric-react";
import React from "react";
import {
  ScreenEnum,
  useScreenSetup,
} from "../../context/screenSetup/screenSetup";

const Header = () => {
  const { screen, closeModal } = useScreenSetup();
  const steps = [
    "Setup",
    "Review",
    "Select Certificate",
    "Configure",
    "Signing",
    "Complete",
  ];

  return (
    <>
      <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-[rgb(225,223,221)] tw-bg-white tw-p-6">
        <div>
          <h2 className="tw-font-semibold tw-text-2xl tw-text-[rgb(32,31,30)]">
            Sign Documents
          </h2>
          <p className="tw-mt-1 tw-text-[rgb(96,94,92)] tw-text-sm">
            Step {screen + 1} of {steps.length}
          </p>
        </div>
        <IconButton
          iconProps={{ iconName: "Cancel" }}
          ariaLabel="Close"
          onClick={closeModal}
          disabled={screen === ScreenEnum.Progress}
          styles={{
            root: {
              color: "rgb(96, 94, 92)",
            },
            rootHovered: {
              color: "rgb(32, 31, 30)",
              backgroundColor: "rgb(243, 242, 241)",
            },
          }}
        />
      </div>
      <div className="tw-flex tw-border-b tw-border-[rgb(225,223,221)] tw-bg-[rgb(250,249,248)]">
        {steps.map((label, step) => (
          <div
            key={step}
            className={`tw-flex-1 tw-border-b-2 tw-py-3 tw-text-center tw-text-sm tw-transition-colors ${
              step === screen
                ? "tw-border-[rgb(0,120,212)] tw-font-semibold tw-text-[rgb(0,120,212)]"
                : step < screen
                ? "tw-border-[rgb(16,124,16)] tw-text-[rgb(16,124,16)]"
                : "tw-border-transparent tw-text-[rgb(96,94,92)]"
            }`}
          >
            {label}
          </div>
        ))}
      </div>
    </>
  );
};

export default Header;
