import { PeculiarFortifyCertificatesCustomEvent } from "@peculiar/fortify-webcomponents";
import { ISelectionSuccessEvent } from "@peculiar/fortify-webcomponents/dist/types/components/fortify-certificates/fortify-certificates";
import { SocketCrypto, SocketProvider } from "@webcrypto-local/client";
import { Convert } from "pvtsutils";
import { useCallback, useEffect, useState } from "react";

// eslint-disable-next-line
type WSType = any;

let ws: SocketProvider;
export const initWs = async (): Promise<WSType> => {
  // eslint-disable-next-line
  const storage = await (window as any).WebcryptoSocket.BrowserStorage.create();
  // eslint-disable-next-line
  return new (window as any).WebcryptoSocket.SocketProvider({ storage });
};

export const connectToFortify = async (): Promise<SocketProvider> => {
  // eslint-disable-next-line
  if (!ws) ws = await initWs();
  return await new Promise((resolve, reject) => {
    ws.connect("127.0.0.1:31337")
      .on("error", reject)
      .on("listening", () => resolve(ws));
  });
};

const useSignature = () => {
  const [signingError, setSigningError] = useState<string>();
  const [publicKey, setPublicKey] = useState<string>();
  const [privateKey, setPrivateKey] = useState<CryptoKey>();
  const [providerId, setProviderId] = useState<string>();
  const [provider, setProvider] = useState<SocketCrypto>();

  const getPublicKey = useCallback(
    async (
      event: PeculiarFortifyCertificatesCustomEvent<ISelectionSuccessEvent>,
      callback: (publicKey: string) => void
    ) => {
      const provider = await event.detail.socketProvider.getCrypto(
        event.detail.providerId
      );
      const cert = await provider.certStorage.getItem(
        event.detail.certificateId
      );
      const rawCert = await provider.certStorage.exportCert("raw", cert);
      const base64 = Convert.ToBase64(rawCert);
      const base64Formated = base64.match(/.{1,64}/g)?.join("\n");
      const publicKey = `-----BEGIN CERTIFICATE-----\n${base64Formated}\n-----END CERTIFICATE-----`;
      const privateKey = await provider.keyStorage.getItem(
        event.detail.privateKeyId
      );

      setPublicKey(publicKey);
      setPrivateKey(privateKey);
      setProviderId(provider.id);
      callback(publicKey);
    },
    []
  );

  const login = async (
    providerId?: string
  ): Promise<SocketCrypto | undefined> => {
    if (!providerId) return Promise.resolve(undefined);
    const conn = await connectToFortify();
    const isLoggedIn = await conn.isLoggedIn();
    if (!isLoggedIn) {
      await conn.challenge();
      await conn.login();
    }
    return await conn.getCrypto(providerId);
  };

  useEffect(() => {
    login(providerId)
      .then((provider) => setProvider(provider))
      .catch((e) => setSigningError(e.message));
  }, [providerId]);

  const signHash = async (hash: string) => {
    if (!privateKey || !provider)
      throw new Error("No private key or provider available.");

    const algorithm = {
      name: privateKey.algorithm.name,
      hash: "SHA-256",
    };

    const signedData = await provider?.subtle.sign(
      algorithm,
      privateKey,
      Convert.FromHex(hash)
    );
    return Convert.ToHex(signedData);
  };

  return {
    signingError,
    getPublicKey,
    publicKey,
    signHash,
  };
};

export default useSignature;
