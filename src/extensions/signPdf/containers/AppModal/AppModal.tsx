import { IModalStyles, Modal, Text } from "@fluentui/react";
import * as React from "react";

import InitialScreen from "../InitialScreen/InitialScreen";
import PickCertificate from "../PickCertificate/PickCertificate";

import { useScreenSetup } from "../../context/screenSetup/screenSetup";
import Detail from "../Detail/Detail";
import Progress from "../Progress/Progress";
import Victory from "../Victory/Victory";

const modalStyles: Partial<IModalStyles> = {
  main: { width: 800, padding: "20px" },
};

const SigningModal = () => {
  const screenSetup = useScreenSetup();

  return (
    <Modal
      isOpen
      onDismiss={screenSetup.closeModal}
      isBlocking={false}
      containerClassName="ms-signatureModal-container"
      styles={modalStyles}
    >
      <Text
        variant="small"
        styles={{ root: { color: "#a80000", marginBottom: 10 } }}
      >
        {screenSetup.lastError}
      </Text>

      {screenSetup.screen === "init" && <InitialScreen />}
      {screenSetup.screen === "certificate" && <PickCertificate />}
      {screenSetup.screen === "detail" && <Detail />}
      {screenSetup.screen === "progress" && <Progress />}
      {screenSetup.screen === "victory" && <Victory />}
    </Modal>
  );
};

export default SigningModal;
