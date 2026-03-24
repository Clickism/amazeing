import { type PropsWithChildren, useMemo } from "react";
import { CodeModelContext } from "./CodeModelContext.tsx";
import { useTranslatable } from "../../../../shared/i18n/i18n.ts";
import { useSingleSource } from "../source/useSingleSource.ts";
import type { Task } from "../../../precourse/task.ts";
import { SourceTypeContext } from "./SourceTypeContext.tsx";

type TaskCodeModelProviderProps = {
  /**
   * The task to provide the code model for.
   */
  task: Task;
  namespace: string;
};

/**
 * Provides a code model that for tasks.
 *
 * Task code is saved automatically and loaded based on the
 * current task.
 */
export function TaskCodeModelProvider({
  task,
  namespace,
  children,
}: PropsWithChildren<TaskCodeModelProviderProps>) {
  const { t } = useTranslatable();

  const source = useSingleSource<string>({
    key: task.id,
    name: t(task.title),
    defaultData: task.startingCode ?? t("codeStorage.newFile.content"),
    namespace,
  });

  const sourceType = useMemo(
    () => ({
      isMultiSource: false,
    }),
    [],
  );

  return (
    <CodeModelContext.Provider
      value={{
        code: source.data,
        setCode: source.setData,
        source,
      }}
    >
      <SourceTypeContext.Provider value={sourceType}>
        {children}
      </SourceTypeContext.Provider>
    </CodeModelContext.Provider>
  );
}
