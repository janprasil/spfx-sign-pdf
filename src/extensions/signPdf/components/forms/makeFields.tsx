import { type OuterFieldDefinition } from "./types";

export const makeFields = <T extends { [key: string]: OuterFieldDefinition }>(
  fields: T
): T => fields;

export const makeUseFields = <
  T extends { [key: string]: OuterFieldDefinition }
>(
  useFields: () => T
): (() => T) => useFields;
