import { useCallback } from "react";
import { SignatureFormData } from "./SignatureForm";
import { useSigning } from "../../context/signing/SigningProvider";
import {
  ScreenEnum,
  useScreenSetup,
} from "../../context/screenSetup/screenSetup";
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
      setScreen(ScreenEnum.Progress);
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
        setScreen(ScreenEnum.Victory);
      } catch (e: any) {
        console.error(e);
        setLastError(e?.message ?? strings.signingUnknownError);
        setScreen(ScreenEnum.Detail);
      }
    },
    [aadClient, files, getPublicKey, publicKey, resetProgress, signHash]
  );

  return {
    signDocuments: applyDocumentSign,
  };
};

export default useSignInit;
