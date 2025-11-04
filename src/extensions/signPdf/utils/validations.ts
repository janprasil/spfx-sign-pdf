import { SignatureFormInputType } from "../components/SignatureForm/SignatureSingleFileForm";

export const isValidSignatureField = (sign?: SignatureFormInputType) => {
  return (
    sign &&
    sign.location &&
    sign.reason &&
    sign.rect?.height &&
    sign.rect?.width &&
    sign.rect?.x &&
    sign.rect?.y
  );
};
