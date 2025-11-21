export type AttachmentColumn = {
  internalName: string;
  displayName: string;
  fieldType: string;
};

export type UploadedAttachment = {
  base64Content?: string;
  fileName?: string;
};
