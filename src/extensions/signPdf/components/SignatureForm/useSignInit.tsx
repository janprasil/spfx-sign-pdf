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
  const { signHash, publicKey } = useSigning();
  const {
    resetProgress,
    setScreen,
    files,
    setLastError,
    setUploadedFiles,
    planInfo,
  } = useScreenSetup();

  const applyDocumentSign = useCallback(
    async (form: SignatureFormData) => {
      if (!aadClient) return;
      resetProgress();
      setScreen(ScreenEnum.Progress);
      try {
        const [companyImage, privateImage] = await Promise.all([
          fetchAndCreateBase64(planInfo?.companyImageSignature),
          fetchAndCreateBase64(planInfo?.userImageSignature),
        ]);

        // if (!publicKey) {
        //   // SIGN WITH /timestamp endpoint
        //   return;
        // }

        await signDocuments({
          files,
          form,
          aadClient,
          signHash,
          publicKey,
          onProgress: (done) => setUploadedFiles(done),
          concurrency: 5,
          images:
            companyImage || privateImage
              ? {
                  companyImage,
                  privateImage,
                }
              : undefined,
        });
        setScreen(ScreenEnum.Victory);
      } catch (e: any) {
        console.error(JSON.stringify(e));
        setLastError(e?.message ?? strings.signingUnknownError);
        setScreen(ScreenEnum.Detail);
      }
    },
    [
      aadClient,
      files,
      planInfo,
      publicKey,
      resetProgress,
      setLastError,
      setScreen,
      setUploadedFiles,
      signHash,
    ]
  );

  return {
    signDocuments: applyDocumentSign,
  };
};

export default useSignInit;

async function fetchAndCreateBase64(
  imageSignature: string | undefined
): Promise<string | undefined> {
  if (!imageSignature) return undefined;

  // Already a data URI
  if (/^data:image\/[a-zA-Z]+;base64,/.test(imageSignature))
    return imageSignature;

  // Raw base64 (best-effort heuristic)
  const rawBase64Pattern = /^[A-Za-z0-9+/=]+$/;
  if (
    rawBase64Pattern.test(imageSignature) &&
    imageSignature.length % 4 === 0
  ) {
    return `${imageSignature}`;
  }

  // URL provided – cannot synchronously fetch here
  if (/^https?:\/\//.test(imageSignature)) {
    try {
      const response = await fetch(imageSignature);
      if (!response.ok) {
        console.warn(
          "fetchAndCreateBase64: failed to fetch image URL",
          response.status,
          response.statusText
        );
        return undefined;
      }
      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      return `${base64}`;
    } catch (error) {
      console.error("fetchAndCreateBase64: error fetching image", error);
      return undefined;
    }
  }

  // Fallback: return as-is (could be already acceptable to backend)
  return imageSignature;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }

  return btoa(binary);
}
