import { TasksContext } from "./TasksContext.tsx";
import { type ReactNode, useMemo, useState } from "react";
import { loadDays } from "../day.ts";

type DaysProviderProps = {
  taskId?: string;
  children: ReactNode;
};

export function TasksProvider({
  taskId: initialTaskId,
  children,
}: DaysProviderProps) {
  const [taskId, setTaskId] = useState<string | null>(initialTaskId ?? null);
  const days = useMemo(() => loadDays(), []);
  const task = useMemo(() => {
    const allTasks = days.flatMap((day) => day.tasks);
    return allTasks.find((t) => t.id === taskId)!;
  }, [days, taskId]);
  return (
    <TasksContext.Provider
      value={{
        task,
        setTaskId,
        days,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
