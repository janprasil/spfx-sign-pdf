import { CSSProperties } from "react";
import Checkbox from "./Checkbox/Checkbox";
import createField from "./createFields";
import File from "./File/FIle";
import Input from "./Input/Input";
import Select from "./Select/Select";
import PdfPreview from "./PdfPreview/PdfSignaturePreview";
import { PdfSignaturePreviewProps } from "../../types/pdfPreview";

export { default as createField } from "./createFields";
export { default as FormProvider } from "./FormProvider";
export * from "./makeFields";
export { default as useForm } from "./useForm";

export const InputField = createField(Input);
export const SelectField = createField(Select);
export const CheckboxField = createField(Checkbox);
export const FileField = createField<{ style?: CSSProperties }>(File);
export const PdfPreviewField =
  createField<PdfSignaturePreviewProps>(PdfPreview);
