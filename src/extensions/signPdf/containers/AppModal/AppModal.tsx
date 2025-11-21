import { Modal, Text } from "@fluentui/react";
import * as React from "react";

import InitialScreen from "../InitialScreen/InitialScreen";
import PickCertificate from "../PickCertificate/PickCertificate";

import { IModalStyles } from "office-ui-fabric-react";
import Header from "../../components/Header/Header";
import {
  ScreenEnum,
  useScreenSetup,
} from "../../context/screenSetup/screenSetup";
import Detail from "../Detail/Detail";
import Progress from "../Progress/Progress";
import Victory from "../Victory/Victory";
import Onboarding from "../Onboarding/Onboarding";

const SigningModal = () => {
  const screenSetup = useScreenSetup();
  const modalStyles: Partial<IModalStyles> = {
    main: {
      width: screenSetup.detailPanelOpen ? "80vw" : 800,
      maxWidth: "90vw",
      transition: "width 0.2s ease",
    },
  };

  return (
    <Modal
      isOpen
      onDismiss={screenSetup.closeModal}
      isBlocking={true}
      isClickableOutsideFocusTrap
      containerClassName="ms-signatureModal-container"
      styles={modalStyles}
    >
      <Header />
      <Text variant="small" className="tw-text-red-600 tw-mb-2">
        {screenSetup.lastError}
      </Text>

      {screenSetup.screen === ScreenEnum.Init && <InitialScreen />}
      {screenSetup.screen === ScreenEnum.Onboarding && <Onboarding />}
      {screenSetup.screen === ScreenEnum.Certificate && <PickCertificate />}
      {screenSetup.screen === ScreenEnum.Detail && <Detail />}
      {screenSetup.screen === ScreenEnum.Progress && <Progress />}
      {screenSetup.screen === ScreenEnum.Victory && <Victory />}
    </Modal>
  );
};

export default SigningModal;
