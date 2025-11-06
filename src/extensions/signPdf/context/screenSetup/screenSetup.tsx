import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { FileDefinition } from "../../types/files";
import { createRenderer } from "../../utils/renderer";

type Props = PropsWithChildren<{
  files: FileDefinition[];
  renderer: ReturnType<typeof createRenderer>;
}>;

export enum ScreenEnum {
  Init = 0,
  Certificate = 1,
  Detail = 2,
  Progress = 3,
  Victory = 4,
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
};

const ScreenSetupContext = createContext<Partial<ScreenSetupContext>>({});

export const ScreenSetupProvider: React.FC<Props> = ({
  children,
  renderer,
  files,
}: Props) => {
  const [screen, setScreen] = useState<ScreenEnum>(ScreenEnum.Init);
  const [uploadedFiles, setUploadedFiles] = useState(0);
  const [lastError, setLastError] = useState<string>();

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
