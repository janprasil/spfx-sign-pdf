export interface FileDefinition {
  name: string;
  url: string;
  spItemUrl: string;
  serverRelativeUrl: string;
  /** Raw item values keyed by internal field name */
  columnValues?: Record<string, any>;
}
