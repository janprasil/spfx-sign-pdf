import { PrimaryButton, Stack, Text } from "office-ui-fabric-react";
import React from "react";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";
import strings from "SignPdfStrings";

const Victory = () => {
  const screenSetup = useScreenSetup();
  return (
    <Stack tokens={{ childrenGap: 12 }}>
      <Text>{strings.victoryTitle}</Text>
      <PrimaryButton onClick={screenSetup.closeModal}>
        {strings.closeWindow}
      </PrimaryButton>
    </Stack>
  );
};

export default Victory;
