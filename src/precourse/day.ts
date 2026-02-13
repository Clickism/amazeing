import type { Task, TaskData } from "./task.ts";
import type { Translator } from "../i18n/i18n.ts";

export type Day = {
  id: string;
  tasks: Task[];
};

export function loadDays(): Day[] {
  const pathToTasks = import.meta.glob("./tasks/**/*.json", {
    eager: true,
    import: "default",
  });
  const daysMap: Record<string, Task[]> = {};

  for (const path in pathToTasks) {
    const taskData = pathToTasks[path] as TaskData;
    const { dayId, taskKey } = extractDayAndTask(path);

    const taskNumber = parseInt(taskKey.replace("task", ""), 10);

    const task: Task = {
      ...taskData,
      id: taskIdOf(dayId, taskNumber),
      dayId: dayId,
      taskNumber,
    };

    if (!daysMap[dayId]) {
      daysMap[dayId] = [];
    }
    daysMap[dayId].push(task);
  }

  return Object.entries(daysMap).map(([key, tasks]) => ({
    id: key,
    tasks,
  }));
}

function extractDayAndTask(path: string): { dayId: string; taskKey: string } {
  const parts = path.split("/");
  // Extract "dayX" from the path "./tasks/dayX/taskY.json"
  const dayId = parts[parts.length - 2];
  // Extract "taskY" and remove ".json"
  const taskKey = parts[parts.length - 1].replace(".json", "");
  return { dayId, taskKey };
}

/**
 * Generates a unique task ID based on the day ID and task number.
 * @param dayId The identifier of the day (e.g., "day1") or the day number (e.g., 1).
 * @param taskNumber The number of the task within the day (e.g., 1) or the task key (e.g., "task1").
 */
export function taskIdOf(dayId: string | number, taskNumber: number | string) {
  const day = typeof dayId === "string" ? dayId : `day${dayId}`;
  const task =
    typeof taskNumber === "string" ? taskNumber : `task${taskNumber}`;
  return `${day}-${task}`;
}

export function translateDayId(t: Translator, dayId: string) {
  if (dayId.startsWith("day")) {
    const dayNumber = dayId.replace("day", "");
    return t("day.day", { num: dayNumber });
  }
  return t(`day.days.${dayId}`);
}
