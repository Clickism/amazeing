import { type PropsWithChildren, useEffect } from "react";
import {
  type CodeEditorSettings,
  CodeEditorSettingsContext,
} from "./CodeEditorSettingsContext.tsx";
import {
  usePersistentState,
  usePersistentStorage,
} from "../../../../shared/utils/storage.ts";

const DEFAULT_CODE_EDITOR_SETTINGS: CodeEditorSettings = {
  fontSize: 16,
};

type CodeEditorSettingsProviderProps = {
  namespace: string;
};

export function CodeEditorSettingsProvider({
  namespace,
  children,
}: PropsWithChildren<CodeEditorSettingsProviderProps>) {
  const storage = usePersistentStorage(namespace);
  const [settings, setSettingsState] = usePersistentState<CodeEditorSettings>(
    storage,
    "settings",
    DEFAULT_CODE_EDITOR_SETTINGS,
  );

  useEffect(() => {
    // Set tooltip font size
    document.getElementById("tooltip-root")!.style.fontSize =
      `${settings.fontSize}px`;
  }, [settings.fontSize]);

  const setSettings = (newSettings: Partial<CodeEditorSettings>) => {
    setSettingsState((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  return (
    <CodeEditorSettingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {children}
    </CodeEditorSettingsContext.Provider>
  );
}
