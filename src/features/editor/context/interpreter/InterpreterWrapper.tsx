import type { PropsWithChildren } from "react";
import { useCodeModel } from "../code/CodeModelContext.tsx";
import { useEditorSettings } from "../settings/EditorSettingsContext.tsx";
import {
  InterpreterProvider,
  type InterpreterProviderProps,
} from "./InterpreterProvider.tsx";

type InterpreterWrapperProps = Omit<
  InterpreterProviderProps,
  "settings" | "code"
>;

/**
 * Wrapper to use interpreter context with {@link CodeModelContext} and {@link EditorSettingsContext}.
 */
export function InterpreterWrapper({
  children,
  ...props
}: PropsWithChildren<InterpreterWrapperProps>) {
  const { code } = useCodeModel();
  const { settings } = useEditorSettings();
  return (
    <InterpreterProvider code={code} settings={settings} {...props}>
      {children}
    </InterpreterProvider>
  );
}
