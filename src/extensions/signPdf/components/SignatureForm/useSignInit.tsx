import { useCallback } from "react";
import { SignatureFormData } from "./SignatureForm";
import { useSigning } from "../../context/signing/SigningProvider";
import { useScreenSetup } from "../../context/screenSetup/screenSetup";
import { signDocuments } from "../../services/signingService";
import { useWebClient } from "../../context/webClient/webClient";
import strings from "SignPdfStrings";

const useSignInit = () => {
  const { aadClient } = useWebClient();
  const { getPublicKey, signHash, publicKey } = useSigning();
  const { resetProgress, setScreen, files, setLastError, setUploadedFiles } =
    useScreenSetup();

  const applyDocumentSign = useCallback(
    async (form: SignatureFormData) => {
      if (!aadClient) return;
      resetProgress();
      setScreen("progress");
      try {
        if (!publicKey) throw new Error(strings.publicKeyUnavailable);
        await signDocuments({
          files,
          form,
          aadClient,
          signHash,
          publicKey,
          onProgress: (done) => setUploadedFiles(done),
          concurrency: 5,
        });
        setScreen("victory");
      } catch (e: any) {
        console.error(e);
        setLastError(e?.message ?? strings.signingUnknownError);
        setScreen("detail");
      }
    },
    [aadClient, files, getPublicKey, publicKey, resetProgress, signHash]
  );

  return {
    signDocuments: applyDocumentSign,
  };
};

export default useSignInit;
