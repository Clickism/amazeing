import type { ReactNode } from "react";
import {
  type EditorSettings,
  EditorSettingsContext,
} from "./EditorSettingsContext.tsx";
import {
  usePersistentState,
  usePersistentStorage,
} from "../../../shared/utils/storage.ts";

const DEFAULT_EDITOR_SETTINGS: EditorSettings = {
  instructionsPerSecond: 5,
  isInstant: false,
};

type EditorSettingsProviderProps = {
  namespace: string;
  children: ReactNode;
};

export function EditorSettingsProvider({
  namespace,
  children,
}: EditorSettingsProviderProps) {
  const storage = usePersistentStorage(namespace);
  const [settings, setSettingsState] = usePersistentState<EditorSettings>(
    storage,
    "settings",
    DEFAULT_EDITOR_SETTINGS,
  );
  const setSettings = (newSettings: Partial<EditorSettings>) => {
    setSettingsState((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };
  return (
    <EditorSettingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {children}
    </EditorSettingsContext.Provider>
  );
}
