import { TasksContext } from "./TasksContext.tsx";
import { type ReactNode, useMemo } from "react";
import { loadDays } from "../day.ts";

type DaysProviderProps = {
  taskId?: string;
  children: ReactNode;
};

export function TasksProvider({ taskId, children }: DaysProviderProps) {
  const days = useMemo(() => loadDays(), []);
  const task = useMemo(() => {
    const allTasks = days.flatMap((day) => day.tasks);
    return allTasks.find((t) => t.id === taskId)!;
  }, [days, taskId]);
  return (
    <TasksContext.Provider
      value={{
        task,
        days,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
