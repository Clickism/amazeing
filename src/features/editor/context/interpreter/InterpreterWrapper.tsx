import type { Level } from "../../../../core/game/level.ts";
import type { PropsWithChildren } from "react";
import { useCodeModel } from "../code/CodeModelContext.tsx";
import { useEditorSettings } from "../settings/EditorSettingsContext.tsx";
import { InterpreterProvider } from "./InterpreterProvider.tsx";
import type { Constraint, EvaluatedConstraint } from "../../../../core/game/constraints.ts";

type InterpreterWrapperProps = {
  level: Level;
  constraints?: Constraint[];
  onFinish?: (evaluatedConstraints: EvaluatedConstraint[]) => void;
};

/**
 * Wrapper to use interpreter context with {@link CodeModelContext} and {@link EditorSettingsContext}.
 */
export function InterpreterWrapper({
  level,
  constraints,
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
      constraints={constraints}
      onFinish={onFinish}
    >
      {children}
    </InterpreterProvider>
  );
}
