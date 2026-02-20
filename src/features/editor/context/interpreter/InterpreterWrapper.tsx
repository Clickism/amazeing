import type { Level } from "../../../../core/game/level.ts";
import type { PropsWithChildren } from "react";
import { useCodeModel } from "../code/CodeModelContext.tsx";
import { useEditorSettings } from "../settings/EditorSettingsContext.tsx";
import { InterpreterProvider } from "./InterpreterProvider.tsx";

type InterpreterWrapperProps = {
  level: Level;
  onFinish?: () => void;
};

/**
 * Wrapper to use interpreter context with {@link CodeModelContext} and {@link EditorSettingsContext}.
 */
export function InterpreterWrapper({
  level,
  onFinish,
  children,
}: PropsWithChildren<InterpreterWrapperProps>) {
  const { code } = useCodeModel();
  const { settings } = useEditorSettings();
  return (
    <InterpreterProvider
      code={code}
      level={level}
      settings={settings}
      onFinish={onFinish}
    >
      {children}
    </InterpreterProvider>
  );
}
