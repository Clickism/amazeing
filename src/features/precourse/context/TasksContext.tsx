import type { Day } from "../day.ts";
import { createContext, useContext } from "react";
import type { Task } from "../task.ts";

export type TasksAPI = {
  task: Task;
  setTaskId: (taskId: string) => void;
  completedTasks: string[];
  setCompleted(taskId: string, completed: boolean): void;
  days: Day[];
}

export const TasksContext = createContext<TasksAPI | null>(null);

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useDays must be used within a days provider");
  return ctx;
}
