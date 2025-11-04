import { Stack, Text } from "office-ui-fabric-react";
import React from "react";
import SignatureForm from "../../components/SignatureForm/SignatureForm";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";

const Detail = () => {
  const screenSetup = useScreenSetup();

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      {screenSetup.lastError && (
        <Text variant="small" styles={{ root: { color: "#a80000" } }}>
          {screenSetup.lastError}
        </Text>
      )}
      <SignatureForm />
    </Stack>
  );
};

export default Detail;
