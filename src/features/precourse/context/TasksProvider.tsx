import { TasksContext } from "./TasksContext.tsx";
import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { loadDays } from "../day.ts";
import {
  usePersistentState,
  usePersistentStorage,
} from "../../../shared/utils/storage.ts";
import type { EvaluatedConstraint } from "../../../core/game/constraints.ts";

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
  const [partiallyCompletedTasks, setPartiallyCompletedTasks] =
    usePersistentState<Record<string, EvaluatedConstraint[]>>(
      storage,
      "partiallyCompletedTasks",
      {},
    );

  const setPartiallyCompleted = useCallback(
    (taskId: string, constraints: EvaluatedConstraint[] | false) => {
      setPartiallyCompletedTasks((prev) => {
        if (Array.isArray(constraints)) {
          if (completedTasks.includes(taskId)) {
            return prev;
          }
          return { ...prev, [taskId]: constraints };
        } else {
          delete prev[taskId];
          return prev;
        }
      });
    },
    [completedTasks, setPartiallyCompletedTasks],
  );

  const setCompleted = useCallback(
    (taskId: string, completed: boolean) => {
      if (completed) {
        setPartiallyCompleted(taskId, false);
      }
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
    },
    [setCompletedTasks, setPartiallyCompleted],
  );

  return (
    <TasksContext.Provider
      value={{
        task,
        setTaskId,
        completedTasks,
        setCompleted,
        partiallyCompletedTasks,
        setPartiallyCompleted,
        days,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
