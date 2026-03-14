import { loadTaskFromString, type Task, type TaskData } from "./task.ts";
import type { Translator } from "../../shared/i18n/i18n.ts";

export type Day = {
  id: string;
  tasks: Task[];
};

const taskModules = import.meta.glob("./tasks/**/*.json", {
  eager: true,
  query: "?raw",
  import: "default",
});

export function loadDays(): Day[] {
  const daysMap: Record<string, Task[]> = {};

  for (const path in taskModules) {
    // Only consider days tasks
    if (!path.startsWith("./tasks/days/")) continue;
    const raw = taskModules[path] as string;
    const taskData = loadTaskFromString(raw);
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

/**
 * Loads a task from the specified path.
 * @param pathToTask relative path to the task JSON file (e.g., "sandbox/task1") without the ".json" extension.
 */
export function loadTask(pathToTask: string): TaskData {
  let fullPath = `./tasks/${pathToTask}.json5`;
  if (!(fullPath in taskModules)) {
    // Try old json
    fullPath = `./tasks/${pathToTask}.json`;
  }
  if (!(fullPath in taskModules)) {
    throw new Error(`Task not found at path: ${fullPath}`);
  }
  const raw = taskModules[fullPath] as string;
  return loadTaskFromString(raw);
}

function extractDayAndTask(path: string): { dayId: string; taskKey: string } {
  const parts = path.split("/");
  // Extract "dayX" from the path "./tasks/dayX/taskY.json"
  const dayId = parts[parts.length - 2];
  // Extract "taskY" and remove ".json"
  const taskKey = parts[parts.length - 1].replace(/\.json5?/, "");
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
