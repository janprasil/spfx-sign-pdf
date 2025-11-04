import { AadHttpClient } from "@microsoft/sp-http";

export class CustomAadHttpClient extends AadHttpClient {
  public async post<T>(urlOrBody: string | {}, maybeBody?: {}): Promise<T> {
    const url = typeof urlOrBody === "string" ? urlOrBody : "/";
    const body = typeof urlOrBody === "object" ? urlOrBody : maybeBody;
    const resp = await super.post(
      (process.env.SIGN_API_URL + url).replace(/(?<!https?:)\/{2,}/g, "/"),
      AadHttpClient.configurations.v1,
      {
        body: JSON.stringify(body),
      }
    );
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`HTTP ${resp.status}: ${text}`);
    }
    return (await resp.json()) as T;
  }

  public static from(client: AadHttpClient): CustomAadHttpClient {
    if (client instanceof CustomAadHttpClient) {
      return client;
    }
    const anyClient = client as any;
    const scope = anyClient._serviceScope;
    const resource = anyClient._resourceUrl;
    return new CustomAadHttpClient(scope, resource);
  }

  public static ensure(client: AadHttpClient): CustomAadHttpClient {
    return client instanceof CustomAadHttpClient
      ? client
      : CustomAadHttpClient.from(client);
  }
}
