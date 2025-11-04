import { PeculiarFortifyCertificates } from "@peculiar/fortify-webcomponents-react";
import "@peculiar/fortify-webcomponents/dist/peculiar/peculiar.css";
import { DefaultButton, Stack } from "office-ui-fabric-react";
import * as React from "react";
import { useCallback } from "react";
import strings from "SignPdfStrings";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";
import { useSigning } from "../../context/signing/SigningProvider";

const PickCertificate = (): React.ReactElement => {
  const screenSetup = useScreenSetup();
  const { getPublicKey } = useSigning();

  const handleSelect = useCallback(() => {
    screenSetup.setScreen("detail");
  }, []);
  return (
    <>
      <PeculiarFortifyCertificates
        onSelectionSuccess={async (event) => {
          await getPublicKey(event, handleSelect);
        }}
        filters={{ onlyWithPrivateKey: true }}
      />
      <Stack
        horizontal
        tokens={{ childrenGap: 10 }}
        styles={{ root: { marginTop: 20 } }}
      >
        <DefaultButton
          text={strings.cancelButton}
          onClick={screenSetup.closeModal}
        />
      </Stack>
    </>
  );
};

export default PickCertificate;
