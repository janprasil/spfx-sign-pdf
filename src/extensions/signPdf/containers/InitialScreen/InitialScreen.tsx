import * as React from "react";
import strings from "SignPdfStrings";
import DocumentsList from "../../components/DocumentsList/DocumentsList";
import Footer from "../../components/Footer/Footer";
import UsageBar from "../../components/UsageBar/UsageBar";
import {
  ScreenEnum,
  useScreenSetup,
} from "../../context/screenSetup/screenSetup";
import "./styles.css";
import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";

const InitialScreen = (): React.ReactElement => {
  const { closeModal, setScreen } = useScreenSetup();
  return (
    <>
      <ContentWrapper>
        <div className="tw-space-y-2">
          <DocumentsList />
          <UsageBar />
        </div>
      </ContentWrapper>
      <Footer
        next={{
          text: strings.continueButton,
          onClick: () => setScreen(ScreenEnum.Certificate),
        }}
        back={{
          onClick: closeModal,
          text: strings.cancelButton,
        }}
      />
    </>
  );
};

export default InitialScreen;
