import { TasksContext } from "./TasksContext.tsx";
import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { loadDays } from "../day.ts";
import {
  usePersistentState,
  usePersistentStorage,
} from "../../../shared/utils/storage.ts";
import { useModalContext } from "../../../shared/floating/context/ModalContext.tsx";
import { TaskCompleted } from "../components/TaskCompleted/TaskCompleted.tsx";
import { useTranslation } from "react-i18next";

type TasksProviderProps = {
  taskId?: string;
  namespace: string;
};

// TODO: Keep last task in persistent state
// TODO: Add popup after completing a task
export function TasksProvider({
  taskId: initialTaskId,
  namespace,
  children,
}: PropsWithChildren<TasksProviderProps>) {
  const [taskId, setTaskId] = useState<string | null>(initialTaskId ?? null);
  const days = useMemo(() => loadDays(), []);
  const task = useMemo(() => {
    const allTasks = days.flatMap((day) => day.tasks);
    return allTasks.find((t) => t.id === taskId)!;
  }, [days, taskId]);

  // Track completed data
  const storage = usePersistentStorage(namespace);
  const [completedTasks, setCompletedTasks] = usePersistentState<string[]>(
    storage,
    "completedTasks",
    [],
  );
  const modal = useModalContext();
  const { t } = useTranslation();

  const setCompleted = useCallback(
    (taskId: string, completed: boolean) => {
      setCompletedTasks((prev) => {
        if (completed) {
          // Don't add duplicates
          if (prev.includes(taskId)) {
            return prev;
          }
          return [...prev, taskId];
        } else {
          return prev.filter((id) => id !== taskId);
        }
      });
      // Popup
      if (completed) {
        modal.setProps({ title: t("taskCompleted.title"), maxWidth: 600 });
        modal.setContent(
          <TaskCompleted
            task={task}
            days={days}
            setTaskId={setTaskId}
            modal={modal}
          />,
        );
        modal.setOpen(true);
      }
    },
    [days, modal, setCompletedTasks, t, task],
  );

  return (
    <TasksContext.Provider
      value={{
        task,
        setTaskId,
        completedTasks,
        setCompleted,
        days,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
