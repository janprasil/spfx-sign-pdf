import { CSSProperties } from "react";
import { PdfSignaturePreviewProps } from "../../types/pdfPreview";
import Checkbox from "./Checkbox/Checkbox";
import createField from "./createFields";
import File from "./File/FIle";
import AttachmentUpload from "./File/AttachmentUpload";
import Input from "./Input/Input";
import PdfPreview from "./PdfPreview/PdfSignaturePreview";
import RadioList from "./RadioList/RadioList";
import Select from "./Select/Select";
import { IChoiceGroupProps } from "office-ui-fabric-react";

export { default as createField } from "./createFields";
export { default as FormProvider } from "./FormProvider";
export * from "./makeFields";
export { default as useForm } from "./useForm";

export const InputField = createField(Input);
export const SelectField = createField(Select);
export const CheckboxField = createField(Checkbox);
export const FileField = createField<{
  style?: CSSProperties;
  hidePreview?: boolean;
}>(File);
export const AttachmentField = createField<{
  helperText?: string;
  maxSizeMb?: number;
}>(AttachmentUpload);
export const PdfPreviewField =
  createField<PdfSignaturePreviewProps>(PdfPreview);
export const RadioListField = createField<{
  options?: IChoiceGroupProps["options"];
}>(RadioList);
