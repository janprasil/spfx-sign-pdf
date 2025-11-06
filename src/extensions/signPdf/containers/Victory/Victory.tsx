import { Icon } from "@fluentui/react/lib/Icon";
import React from "react";
import Footer from "../../components/Footer/Footer";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";

const Victory = () => {
  const screenSetup = useScreenSetup();
  const isFullSuccess = true;

  return isFullSuccess ? (
    <>
      <div className="tw-flex tw-min-h-[400px] tw-flex-col tw-items-center tw-justify-center tw-space-y-6">
        <div className="tw-flex tw-size-24 tw-items-center tw-justify-center tw-rounded-full tw-bg-[rgb(16,124,16)]/10">
          <Icon
            iconName="CompletedSolid"
            styles={{
              root: {
                fontSize: 48,
                color: "rgb(16, 124, 16)",
              },
            }}
          />
        </div>

        <div className="tw-text-center">
          <h3 className="tw-mb-2 tw-font-semibold tw-text-2xl tw-text-[rgb(32,31,30)]">
            Documents Signed Successfully!
          </h3>
          <p className="tw-text-[rgb(96,94,92)] tw-leading-relaxed">
            All {screenSetup.files.length} documents have been signed and saved
            to your SharePoint library
          </p>
        </div>

        <div className="tw-w-full tw-max-w-md tw-space-y-2">
          {screenSetup.files.map((doc) => (
            <div
              key={doc.serverRelativeUrl}
              className="tw-flex tw-items-center tw-gap-3 tw-rounded-sm tw-border tw-border-[rgb(225,223,221)] tw-bg-[rgb(250,249,248)] tw-p-3"
            >
              <Icon
                iconName="CheckMark"
                styles={{
                  root: {
                    fontSize: 16,
                    color: "rgb(16, 124, 16)",
                  },
                }}
              />
              <span className="tw-flex-1 tw-text-[rgb(32,31,30)] tw-text-sm">
                {doc.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Footer
        next={{
          text: "Done",
          onClick: screenSetup.closeModal,
        }}
      />
    </>
  ) : (
    <></>
    // <>
    //   {/* Partial Success State */}
    //   <div className="tw-flex tw-size-24 tw-items-center tw-justify-center tw-rounded-full tw-bg-[rgb(255,185,0)]/10">
    //     <Icon
    //       iconName="WarningSolid"
    //       styles={{
    //         root: {
    //           fontSize: 48,
    //           color: "rgb(255, 185, 0)",
    //         },
    //       }}
    //     />
    //   </div>
    //
    //   <div className="tw-text-center">
    //     <h3 className="tw-mb-2 tw-font-semibold tw-text-2xl tw-text-[rgb(32,31,30)]">
    //       Signing Completed with Errors
    //     </h3>
    //     <p className="tw-text-[rgb(96,94,92)] tw-leading-relaxed">
    //       {successCount} of {documents.length} documents were signed
    //       successfully
    //     </p>
    //   </div>
    //
    //   <MessageBar
    //     messageBarType={MessageBarType.error}
    //     isMultiline={false}
    //     styles={{
    //       root: {
    //         backgroundColor: "rgb(253, 231, 233)",
    //         borderRadius: "2px",
    //         maxWidth: "500px",
    //       },
    //     }}
    //   >
    //     {failedDocuments.length} document(s) failed to sign. Please try
    //     again.
    //   </MessageBar>
    //
    //   <div className="tw-w-full tw-max-w-md tw-space-y-3">
    //     <h4 className="tw-font-semibold tw-text-[rgb(32,31,30)] tw-text-sm">
    //       Failed Documents
    //     </h4>
    //     {failedDocuments.map((docName, index) => (
    //       <div
    //         key={index}
    //         className="tw-flex tw-items-center tw-gap-3 tw-rounded-sm tw-border tw-border-[rgb(164,38,44)] tw-bg-[rgb(253,231,233)] tw-p-3"
    //       >
    //         <Icon
    //           iconName="ErrorBadge"
    //           styles={{
    //             root: {
    //               fontSize: 16,
    //               color: "rgb(164, 38, 44)",
    //             },
    //           }}
    //         />
    //         <span className="tw-flex-1 tw-text-[rgb(164,38,44)] tw-text-sm">
    //           {docName}
    //         </span>
    //       </div>
    //     ))}
    //   </div>
    //
    //   <div className="tw-flex tw-gap-3">
    //     <DefaultButton
    //       text="Retry Failed"
    //       styles={{
    //         root: {
    //           borderRadius: "2px",
    //           height: "40px",
    //           padding: "0 20px",
    //         },
    //       }}
    //     />
    //     <PrimaryButton
    //       text="Close"
    //       onClick={onClose}
    //       styles={{
    //         root: {
    //           backgroundColor: "rgb(0, 120, 212)",
    //           border: "none",
    //           borderRadius: "2px",
    //           height: "40px",
    //           padding: "0 20px",
    //         },
    //         rootHovered: {
    //           backgroundColor: "rgb(16, 110, 190)",
    //         },
    //       }}
    //     />
    //   </div>
  );
};

export default Victory;
