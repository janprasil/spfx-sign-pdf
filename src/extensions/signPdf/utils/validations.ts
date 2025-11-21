import { SignatureFormInputType } from "../components/SignatureForm/SignatureSingleFileForm";

export const isValidSignatureField = (sign?: SignatureFormInputType) => {
  return (
    sign &&
    sign.rect?.height &&
    sign.rect?.width &&
    sign.rect?.x &&
    sign.rect?.y
  );
};
