import { SPFI } from "@pnp/sp";
import * as React from "react";
import { CustomAadHttpClient } from "../../utils/customAadClient";
import { createClient } from "../../utils/httpClient";

type WebClientProviderType = {
  httpClient: ReturnType<typeof createClient>;
  aadClient: CustomAadHttpClient;
  spClient: SPFI;
};

const WebClientContext = React.createContext<WebClientProviderType>({
  httpClient: {} as any,
  aadClient: {} as any,
  spClient: {} as any,
});

export const WebClientProvider = ({
  httpClient,
  aadClient,
  spClient,
  children,
}: React.PropsWithChildren<WebClientProviderType>) => {
  return (
    <WebClientContext.Provider value={{ httpClient, aadClient, spClient }}>
      {children}
    </WebClientContext.Provider>
  );
};

export const useWebClient = () => {
  return React.useContext(WebClientContext);
};
