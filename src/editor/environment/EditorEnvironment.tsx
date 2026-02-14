import type { Level } from "../../game/level.ts";
import type { ReactNode } from "react";
import { CodeStorageProvider } from "../storage/CodeStorageProvider.tsx";
import { EditorSettingsProvider } from "../settings/EditorSettingsProvider.tsx";
import { EditorRuntimeProvider } from "../runtime/EditorRuntimeProvider.tsx";
import { LevelProvider } from "../runtime/LevelProvider.tsx";
import { useLevel } from "../runtime/LevelContext.tsx";

export type EditorEnvironmentProps = {
  level: Level;
  storageNamespace: string;
  settingsNamespace?: string;
  children: ReactNode;
};

export function EditorEnvironment({
  level,
  storageNamespace,
  settingsNamespace,
  children,
}: EditorEnvironmentProps) {
  const settingsNamespaceToUse =
    settingsNamespace ?? `${storageNamespace}-editor`;
  return (
    <CodeStorageProvider fileNamespace={storageNamespace}>
      <EditorSettingsProvider namespace={settingsNamespaceToUse}>
        <LevelProvider level={level}>
          <LevelWrapper>{children}</LevelWrapper>
        </LevelProvider>
      </EditorSettingsProvider>
    </CodeStorageProvider>
  );
}

// Wrapper to access useLevel
function LevelWrapper({ children }: { children: ReactNode }) {
  const { level } = useLevel();
  return (
    <EditorRuntimeProvider level={level}>{children}</EditorRuntimeProvider>
  );
}
