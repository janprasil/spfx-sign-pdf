import { ProgressIndicator } from "@fluentui/react/lib/ProgressIndicator";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import React from "react";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";

const Progress = () => {
  const screenSetup = useScreenSetup();

  const currentDocumentIndex = Math.floor(
    (screenSetup.progress / 100) * screenSetup.files.length
  );
  const currentDocument =
    screenSetup.files[currentDocumentIndex] ||
    screenSetup.files[screenSetup.files.length - 1];

  return (
    <div className="tw-flex tw-min-h-[400px] tw-flex-col tw-items-center tw-justify-center tw-space-y-8">
      <div className="tw-text-center">
        <div className="tw-mx-auto tw-mb-6 tw-flex tw-size-20 tw-items-center tw-justify-center tw-rounded-full tw-bg-[rgb(0,120,212)]/10">
          <Spinner
            size={SpinnerSize.large}
            styles={{
              circle: {
                borderColor:
                  "rgb(0, 120, 212) rgb(237, 235, 233) rgb(237, 235, 233)",
              },
            }}
          />
        </div>
        <h3 className="tw-mb-2 tw-font-semibold tw-text-2xl tw-text-[rgb(32,31,30)]">
          Signing Documents
        </h3>
        <p className="tw-text-[rgb(96,94,92)] tw-leading-relaxed">
          Please wait while we process your documents
        </p>
      </div>

      <div className="tw-w-full tw-max-w-md tw-space-y-4">
        <ProgressIndicator
          percentComplete={screenSetup.progress}
          styles={{
            root: { width: "100%" },
            progressBar: {
              backgroundColor: "rgb(0, 120, 212)",
              borderRadius: "2px",
            },
            progressTrack: {
              backgroundColor: "rgb(237, 235, 233)",
              borderRadius: "2px",
            },
          }}
        />

        <div className="tw-text-center">
          <p className="tw-font-semibold tw-text-[rgb(32,31,30)] tw-text-sm">
            {screenSetup.progress < 100
              ? `Processing: ${currentDocument.name}`
              : "Finalizing..."}
          </p>
          <p className="tw-mt-1 tw-text-[rgb(96,94,92)] tw-text-xs">
            {Math.min(currentDocumentIndex + 1, screenSetup.files.length)} of{" "}
            {screenSetup.files.length} documents
          </p>
        </div>
      </div>

      <div className="tw-rounded-sm tw-border tw-border-[rgb(225,223,221)] tw-bg-[rgb(250,249,248)] tw-p-4">
        <p className="tw-text-center tw-text-[rgb(96,94,92)] tw-text-sm tw-leading-relaxed">
          This process may take a few moments. Please don't close this window.
        </p>
      </div>
    </div>
  );
};

export default Progress;

// import { ProgressIndicator } from "office-ui-fabric-react";
// import React from "react";
// import { useScreenSetup } from "../../context/screenSetup/screenSetup";
// import strings from "SignPdfStrings";

// const Progress = () => {
//   const screenSetup = useScreenSetup();
//   return (
//     <ProgressIndicator
//       label={`${strings.progressLabelPrefix} ${screenSetup.uploadedFiles} / ${screenSetup.files.length}`}
//       description={strings.progressDescription}
//       barHeight={20}
//       percentComplete={screenSetup.progress}
//     />
//   );
// };

// export default Progress;
