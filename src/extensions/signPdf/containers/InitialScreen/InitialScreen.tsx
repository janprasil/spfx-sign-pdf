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
import { Spinner } from "office-ui-fabric-react";

const InitialScreen = (): React.ReactElement => {
  const { closeModal, setScreen, planInfo, files } = useScreenSetup();
  const willExceedLimit = (planInfo?.usage.remaining ?? 0) - files.length < 0;

  return (
    <>
      <ContentWrapper>
        <div className="tw-space-y-2">
          <DocumentsList />
          {planInfo ? (
            <UsageBar willExceedLimit={willExceedLimit} />
          ) : (
            <Spinner className="tw-mt-4" />
          )}
        </div>
      </ContentWrapper>
      <Footer
        next={{
          text: strings.continueButton,
          disabled: willExceedLimit || !planInfo,
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
