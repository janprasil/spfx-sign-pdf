import { PeculiarFortifyCertificates } from "@peculiar/fortify-webcomponents-react";
import "@peculiar/fortify-webcomponents/dist/peculiar/peculiar.css";
import * as React from "react";
import { useCallback } from "react";
import strings from "SignPdfStrings";
import Footer from "../../components/Footer/Footer";
import {
  ScreenEnum,
  useScreenSetup,
} from "../../context/screenSetup/screenSetup";
import { useSigning } from "../../context/signing/SigningProvider";

const PickCertificate = (): React.ReactElement => {
  const screenSetup = useScreenSetup();
  const { getPublicKey } = useSigning();

  const handleSelect = useCallback(() => {
    screenSetup.setScreen(ScreenEnum.Detail);
  }, []);
  return (
    <>
      <PeculiarFortifyCertificates
        onSelectionSuccess={async (event) => {
          await getPublicKey(event, handleSelect);
        }}
        filters={{ onlyWithPrivateKey: true }}
      />
      <Footer
        back={{
          onClick: screenSetup.closeModal,
          text: strings.cancelButton,
        }}
      />
    </>
  );
};

export default PickCertificate;
