import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { FileDefinition } from "../../types/files";
import { createRenderer } from "../../utils/renderer";
import { useWebClient } from "../webClient/webClient";
import { UserPlanInfoResponse } from "../../types/responses";
import { AttachmentColumn } from "../../types/attachments";

type Props = PropsWithChildren<{
  files: FileDefinition[];
  renderer: ReturnType<typeof createRenderer>;
  attachmentColumns?: AttachmentColumn[];
  userEmail?: string;
}>;

export enum ScreenEnum {
  Onboarding = 0,
  Init = 1,
  Certificate = 2,
  Detail = 3,
  Progress = 4,
  Victory = 5,
}
export type Screen = keyof typeof ScreenEnum;

type ScreenSetupContext = {
  screen: ScreenEnum;
  setScreen: (screen: ScreenSetupContext["screen"]) => void;
  uploadedFiles: number;
  setUploadedFiles: (count: number) => void;
  lastError?: string;
  setLastError: (error?: string) => void;
  total: number;
  progress: number;
  resetProgress: () => void;
  files: FileDefinition[];
  closeModal: () => void;
  planInfo: UserPlanInfoResponse | undefined;
  attachmentColumns?: AttachmentColumn[];
  detailPanelOpen: boolean;
  setDetailPanelOpen: (open: boolean) => void;
  onboardingStatus?: {
    tenant: { consentRequired: boolean };
    user: { consentRequired: boolean };
  };
  onboardingLoading: boolean;
  onboardingError?: string;
  refreshOnboardingStatus: () => Promise<void>;
  consent: (userConsent: boolean, tenantConsent: boolean) => Promise<void>;
  userEmail?: string;
};

const ScreenSetupContext = createContext<Partial<ScreenSetupContext>>({});

export const ScreenSetupProvider: React.FC<Props> = ({
  children,
  renderer,
  files,
  attachmentColumns,
  userEmail,
}: Props) => {
  const [screen, setScreen] = useState<ScreenEnum>(ScreenEnum.Onboarding);
  const [uploadedFiles, setUploadedFiles] = useState(0);
  const [lastError, setLastError] = useState<string>();
  const [planInfo, setPlanInfo] = useState<UserPlanInfoResponse>();
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState<{
    tenant: { consentRequired: boolean };
    user: { consentRequired: boolean };
  }>();
  const [onboardingLoading, setOnboardingLoading] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string>();

  const { aadClient } = useWebClient();

  const refreshOnboardingStatus = useCallback(async () => {
    if (!aadClient) return;
    setOnboardingLoading(true);
    setOnboardingError(undefined);
    try {
      const { status } = await aadClient.get<{
        status: {
          tenant: { consentRequired: boolean };
          user: { consentRequired: boolean };
        };
      }>("/api/onboarding/status");
      setOnboardingStatus(status);
      if (
        status?.tenant?.consentRequired === false &&
        status?.user?.consentRequired === false
      ) {
        setScreen(ScreenEnum.Init);
      } else {
        setScreen(ScreenEnum.Onboarding);
      }
    } catch (err: any) {
      console.error(err);
      setOnboardingError(err?.message ?? "Failed to load onboarding status");
    } finally {
      setOnboardingLoading(false);
    }
  }, [aadClient]);

  const consent = useCallback(
    async (userConsent: boolean, tenantConsent: boolean) => {
      if (!aadClient) return;
      setOnboardingLoading(true);
      setOnboardingError(undefined);
      try {
        await aadClient.post("/api/onboarding/consent", {
          userConsent,
          tenantConsent,
        });
        await refreshOnboardingStatus();
      } catch (err: any) {
        console.error(err);
        setOnboardingError(err?.message ?? "Consent failed");
      } finally {
        setOnboardingLoading(false);
      }
    },
    [aadClient, refreshOnboardingStatus]
  );

  React.useEffect(() => {
    refreshOnboardingStatus();
  }, [refreshOnboardingStatus]);

  React.useEffect(() => {
    if (
      !aadClient ||
      onboardingStatus?.tenant?.consentRequired !== false ||
      onboardingStatus?.user?.consentRequired !== false
    ) {
      return;
    }
    aadClient
      .get("/api/sharepoint/callback")
      .then(setPlanInfo)
      .catch((err) => console.error("kokot", err));
  }, [
    aadClient,
    onboardingStatus?.tenant?.consentRequired,
    onboardingStatus?.user?.consentRequired,
  ]);

  const total = files.length;
  const progress = total > 0 ? uploadedFiles / total : 0;

  const resetProgress = useCallback(() => {
    setUploadedFiles(0);
    setLastError(undefined);
  }, []);

  const closeModal = (): void => {
    renderer.close();
  };

  const screenSetupValue = {
    screen,
    setScreen,
    uploadedFiles,
    setUploadedFiles,
    lastError,
    setLastError,
    total,
    progress,
    resetProgress,
    files,
    closeModal,
    planInfo,
    attachmentColumns,
    detailPanelOpen,
    setDetailPanelOpen,
    onboardingStatus,
    onboardingLoading,
    onboardingError,
    refreshOnboardingStatus,
    consent,
    userEmail,
  };

  return (
    <ScreenSetupContext.Provider value={screenSetupValue}>
      {children}
    </ScreenSetupContext.Provider>
  );
};

export const useScreenSetup = () => {
  const ctx = useContext(ScreenSetupContext);
  if (!ctx)
    throw new Error("useScreenSetup must be used within <ScreenSetupProvider>");
  return ctx as ScreenSetupContext;
};
