import type { PropsWithChildren } from "react";
import { CodeModelContext } from "./CodeModelContext.tsx";
import { useTranslatable } from "../../../../shared/i18n/i18n.ts";
import { useTasks } from "../../../precourse/context/TasksContext.tsx";
import { useSingleSource } from "../source/useSingleSource.ts";

type TaskCodeModelProviderProps = {
  namespace: string;
};

export function TaskCodeModelProvider({
  namespace,
  children,
}: PropsWithChildren<TaskCodeModelProviderProps>) {
  const { t } = useTranslatable();
  const { task } = useTasks();

  const source = useSingleSource<string>({
    key: task.id,
    name: t(task.title),
    // TODO: Add default code to taskData
    defaultData: t("codeStorage.newFile.content"),
    namespace,
  });

  return (
    <CodeModelContext.Provider
      value={{
        code: source.data,
        setCode: source.setData,
        source,
      }}
    >
      {children}
    </CodeModelContext.Provider>
  );
}
