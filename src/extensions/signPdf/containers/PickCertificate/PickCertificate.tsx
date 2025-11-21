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
  const [step, setStep] = React.useState<"choice" | "certificate">("choice");

  const handleSelect = useCallback(() => {
    screenSetup.setScreen(ScreenEnum.Detail);
  }, [screenSetup]);

  const handleSkipCertificate = useCallback(() => {
    screenSetup.setScreen(ScreenEnum.Detail);
  }, [screenSetup]);

  const handleShowCertificate = useCallback(() => {
    setStep("certificate");
  }, []);

  const handleBackToChoice = useCallback(() => {
    setStep("choice");
  }, []);
  return (
    <div className="tw-flex tw-flex-col tw-gap-6 tw-w-full tw-max-w-4xl tw-mx-auto">
      {step === "choice" && (
        <>
          <div className="tw-space-y-6 tw-p-6">
            <div>
              <h2 className="tw-text-2xl tw-font-semibold tw-text-gray-900">
                {strings.pickCertificateTitle}
              </h2>
              <p className="tw-text-sm tw-text-gray-600 tw-mt-1">
                {strings.pickCertificateDescription}
              </p>
            </div>

            <div className="tw-grid tw-gap-4 md:tw-grid-cols-2">
              <button
                type="button"
                onClick={handleShowCertificate}
                className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-6 tw-text-left tw-bg-white tw-shadow-sm hover:tw-shadow tw-transition-shadow focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
              >
                <span className="tw-block tw-text-lg tw-font-semibold tw-text-gray-900">
                  {strings.pickCertificateOptionCertificateTitle}
                </span>
                <span className="tw-block tw-text-sm tw-text-gray-600 tw-mt-2">
                  {strings.pickCertificateOptionCertificateDescription}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSkipCertificate}
                className="tw-border tw-border-gray-200 tw-rounded-xl tw-p-6 tw-text-left tw-bg-white tw-shadow-sm hover:tw-shadow tw-transition-shadow focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500"
              >
                <span className="tw-block tw-text-lg tw-font-semibold tw-text-gray-900">
                  {strings.pickCertificateOptionTsaTitle}
                </span>
                <span className="tw-block tw-text-sm tw-text-gray-600 tw-mt-2">
                  {strings.pickCertificateOptionTsaDescription}
                </span>
              </button>
            </div>
          </div>
          <Footer
            back={{
              onClick: screenSetup.closeModal,
              text: strings.cancelButton,
            }}
          />
        </>
      )}

      {step === "certificate" && (
        <>
          <PeculiarFortifyCertificates
            downloadAppLink="https://fortifyapp.com/"
            onSelectionSuccess={async (event) => {
              await getPublicKey(event, handleSelect);
            }}
            filters={{ onlyWithPrivateKey: true }}
            onSelectionCancel={handleBackToChoice}
          />
        </>
      )}
    </div>
  );
};

export default PickCertificate;
