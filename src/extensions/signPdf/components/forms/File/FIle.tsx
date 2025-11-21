import { Image, Label, PrimaryButton, Stack } from "office-ui-fabric-react";
import React, { useRef, useState } from "react";
import { FieldDefinition } from "../types";
import strings from "SignPdfStrings";

type Props = FieldDefinition<{
  style?: React.CSSProperties;
  hidePreview?: boolean;
}>;

const File = ({ field, hidePreview = false, ...props }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: React.FormEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      if (file.size > 1 * 1024 * 1024) {
        setError(strings.fileFieldInvalidSize);
        return;
      }
      setError(undefined);

      const reader = new FileReader();
      reader.onloadend = () => {
        field?.onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setError(strings.fileFieldInvalidImage);
    }
  };

  return (
    <Stack horizontalAlign="space-between" style={props.style}>
      <input
        name={field?.name}
        type="file"
        accept="image/png, image/jpeg"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="fileInput"
        ref={fileInputRef}
      />
      {field?.value && !hidePreview && (
        <div className="tw-flex tw-flex-col tw-items-center tw-mb-2">
          <Label>{strings.fileFieldPreviewLabel}</Label>
          <Image
            src={field?.value}
            alt={strings.fileFieldPreviewAlt}
            styles={{
              image: {
                maxWidth: 150,
                maxHeight: 150,
                objectFit: "cover",
              },
            }}
          />
        </div>
      )}
      <PrimaryButton
        text={props.label}
        onClick={() => fileInputRef?.current?.click()}
      />

      {error && <Label style={{ color: "red" }}>{error}</Label>}
    </Stack>
  );
};

export default File;
