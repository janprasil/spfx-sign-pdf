import {
  Label,
  PrimaryButton,
  Stack,
  Text,
} from "office-ui-fabric-react";
import React, { useRef, useState } from "react";
import strings from "SignPdfStrings";
import { FieldDefinition } from "../types";
import { UploadedAttachment } from "../../../types/attachments";

type Props = FieldDefinition<{
  helperText?: string;
  maxSizeMb?: number;
}>;

const MAX_DEFAULT_SIZE_MB = 10;

const AttachmentUpload = ({
  field,
  label,
  helperText,
  maxSizeMb = MAX_DEFAULT_SIZE_MB,
}: Props) => {
  const [error, setError] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.FormEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      return;
    }

    if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
      setError(strings.attachmentFieldInvalidSize);
      field?.onChange(undefined);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string | ArrayBuffer | null;
      if (!result) return;

      const base64Content =
        typeof result === "string"
          ? result.split(",").pop()
          : arrayBufferToBase64(result);

      const payload: UploadedAttachment = {
        base64Content: base64Content ?? undefined,
        fileName: file.name,
      };

      setError(undefined);
      field?.onChange(payload);
    };
    reader.readAsDataURL(file);
  };

  const selectedFileName =
    (field?.value as UploadedAttachment | undefined)?.fileName;

  return (
    <Stack tokens={{ childrenGap: 6 }}>
      {label && <Label>{label}</Label>}
      <input
        name={field?.name}
        type="file"
        onChange={handleFileChange}
        style={{ display: "none" }}
        ref={fileInputRef}
      />
      <PrimaryButton
        text={strings.attachmentFieldButtonLabel}
        onClick={() => fileInputRef?.current?.click()}
      />
      {helperText && (
        <Text variant="small" styles={{ root: { color: "#605e5c" } }}>
          {helperText}
        </Text>
      )}
      {selectedFileName && (
        <Text variant="small" styles={{ root: { color: "#605e5c" } }}>
          {strings.attachmentFieldSelectedFilePrefix} {selectedFileName}
        </Text>
      )}
      {error && <Label style={{ color: "red" }}>{error}</Label>}
    </Stack>
  );
};

export default AttachmentUpload;

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
