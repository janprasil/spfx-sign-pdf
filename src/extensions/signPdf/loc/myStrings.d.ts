declare interface ISignPdfStrings {
  Command1: string;
  CommandSignDocumentsTitle: string;
  signatureFormUseForAllLabel: string;
  signatureFormImageLabel: string;
  signatureFormReasonLabel: string;
  signatureFormLocationLabel: string;
  signatureFormRectLabel: string;
  signatureFormAllDocuments: string;
  signatureFormTitle: string;
  signatureFormSelectPosition: string;
  continueButton: string;
  cancelButton: string;
  signatureSingleTitle: string;
  signaturePlacementHint: string;
  signatureModalPrevious: string;
  signatureModalNext: string;
  signatureModalClose: string;
  signatureModalFileTitlePrefix: string;
  fileFieldInvalidImage: string;
  fileFieldPreviewLabel: string;
  fileFieldPreviewAlt: string;
  progressLabelPrefix: string;
  progressDescription: string;
  pdfPreviewLoading: string;
  signingTitle: string;
  selectedFilesLabel: string;
  victoryTitle: string;
  closeWindow: string;
  publicKeyUnavailable: string;
  validFilesLabel: string;
  signingUnknownError: string;
  fileFieldInvalidSize: string;
}

declare module "SignPdfStrings" {
  const strings: ISignPdfStrings;
  export = strings;
}
