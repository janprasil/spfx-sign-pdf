import { Image, Label, PrimaryButton, Stack } from "office-ui-fabric-react";
import * as React from "react";
import { FieldDefinition } from "../types";
import strings from "SignPdfStrings";

type Props = FieldDefinition<{ style?: React.CSSProperties }>;

const File = ({ field, ...props }: Props) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
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
      <PrimaryButton
        text={props.label}
        onClick={() => fileInputRef?.current?.click()}
      />

      {error && <Label style={{ color: "red" }}>{error}</Label>}
      {field?.value && (
        <Stack
          horizontal={true}
          verticalAlign="center"
          tokens={{ childrenGap: 20 }}
          style={{ marginTop: 10 }}
        >
          <Label>{strings.fileFieldPreviewLabel}</Label>
          <Image
            src={field?.value}
            alt={strings.fileFieldPreviewAlt}
            styles={{
              image: {
                maxWidth: 100,
                maxHeight: 100,
                objectFit: "cover",
              },
            }}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default File;
