import { TasksContext } from "./TasksContext.tsx";
import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { loadDays } from "../day.ts";
import {
  usePersistentState,
  usePersistentStorage,
} from "../../../shared/utils/storage.ts";

type TasksProviderProps = {
  taskId?: string;
  namespace: string;
};

// TODO: Keep last task in persistent state
// TODO: Add popup after completing a task
// TODO: Add mark visualization
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

  const setCompleted = useCallback(
    (taskId: string, completed: boolean) => {
      setCompletedTasks((prev) => {
        if (completed) {
          return [...prev, taskId];
        } else {
          return prev.filter((id) => id !== taskId);
        }
      });
    },
    [setCompletedTasks],
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
