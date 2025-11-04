import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { BaseListViewCommandSet } from "@microsoft/sp-listview-extensibility";

const createSharepointFileClient =
  (config: { siteUrl: string; client: SPHttpClient }) => (fileName: string) =>
    new Promise<ArrayBuffer>((resolve, reject) => {
      config.client
        .get(
          `${config.siteUrl}/_api/web/GetFileByServerRelativeUrl('${fileName}')/$value`,
          SPHttpClient.configurations.v1,
          {
            headers: {
              Accept: "application/octet-stream",
            },
          }
        )
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            return response.arrayBuffer(); // nebo response.blob() podle potřeby
          } else {
            throw new Error(`Error loading file: ${response.statusText}`);
          }
        })
        .then(resolve)
        .catch(reject);
    });

export const createClient = (
  // eslint-disable-next-line
  context: BaseListViewCommandSet<any>["context"]
) => {
  const siteUrl = context.pageContext.web.absoluteUrl;
  const client = context.spHttpClient;
  const httpClient = context.httpClient;
  return {
    getFileFromSharepoint: createSharepointFileClient({ siteUrl, client }),
    apiClient: httpClient,
  };
};
