import { ProgressIndicator } from "office-ui-fabric-react";
import React from "react";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";
import strings from "SignPdfStrings";

const Progress = () => {
  const screenSetup = useScreenSetup();
  return (
    <ProgressIndicator
      label={`${strings.progressLabelPrefix} ${screenSetup.uploadedFiles} / ${screenSetup.files.length}`}
      description={strings.progressDescription}
      barHeight={20}
      percentComplete={screenSetup.progress}
    />
  );
};

export default Progress;
