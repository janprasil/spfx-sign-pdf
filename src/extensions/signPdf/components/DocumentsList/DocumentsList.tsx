import React from "react";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";
import { Icon } from "office-ui-fabric-react";

const DocumentsList = (): React.ReactElement => {
  const { files } = useScreenSetup();
  return (
    <div className="tw-space-y-2 tw-overflow-y-scroll tw-max-h-80">
      {files.map((doc, index) => (
        <div
          key={doc.serverRelativeUrl}
          className="tw-flex tw-items-center tw-gap-4 tw-rounded-sm tw-border tw-border-[rgb(237,235,233)] tw-bg-[rgb(250,249,248)] tw-p-4"
        >
          <div className="tw-flex tw-size-12 tw-items-center tw-justify-center tw-rounded-sm tw-bg-[rgb(0,120,212)] tw-text-white">
            <Icon iconName="PDF" styles={{ root: { fontSize: 24 } }} />
          </div>
          <div className="tw-flex-1">
            <p className="tw-font-medium tw-text-[rgb(32,31,30)] tw-text-sm">
              {doc.name}
            </p>
            {/* <p className="tw-text-[rgb(96,94,92)] tw-text-xs">
              {doc.} • Modified {doc.modified}
            </p> */}
          </div>
          <div className="tw-flex tw-size-8 tw-items-center tw-justify-center tw-rounded-full tw-bg-[rgb(243,242,241)] tw-font-semibold tw-text-[rgb(50,49,48)] tw-text-sm">
            {index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentsList;
