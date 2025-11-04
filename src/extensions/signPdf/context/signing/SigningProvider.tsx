import React, { ReactNode, createContext, useContext, useMemo } from "react";
import useSignature from "../../hooks/useSignature"; // existing hook from your app

export type SigningContextValue = {
  getPublicKey: ReturnType<typeof useSignature>["getPublicKey"];
  signHash: ReturnType<typeof useSignature>["signHash"];
  publicKey?: string;
};

const SigningContext = createContext<SigningContextValue | undefined>(
  undefined
);

export type SigningProviderProps = {
  children: ReactNode;
};

export const SigningProvider: React.FC<SigningProviderProps> = ({
  children,
}) => {
  const { getPublicKey, signHash, publicKey } = useSignature();

  const value: SigningContextValue = useMemo(
    () => ({
      getPublicKey,
      signHash,
      publicKey,
    }),
    [getPublicKey, signHash, publicKey]
  );

  return (
    <SigningContext.Provider value={value}>{children}</SigningContext.Provider>
  );
};

export function useSigning() {
  const ctx = useContext(SigningContext);
  if (!ctx) throw new Error("useSigning must be used within <SigningProvider>");
  return ctx;
}
