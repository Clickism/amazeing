import { loadTaskFromString, type Task, type TaskData } from "./task.ts";
import type { Translator } from "../../shared/i18n/i18n.ts";
import daysDefinitionString from "./tasks/days.json5?raw";
import JSON5 from "json5";

export type Day = {
  id: string;
  tasks: Task[];
};

const taskModules = import.meta.glob("./tasks/**/*.json5", {
  eager: true,
  query: "?raw",
  import: "default",
});

const taskStartingCodes = import.meta.glob("./tasks/**/*.code", {
  eager: true,
  query: "?raw",
  import: "default",
});

export function loadDays(): Day[] {
  const daysMap: Record<string, Task[]> = {};

  // Map from day to task paths
  const daysDefinition: Record<string, string[]> =
    JSON5.parse(daysDefinitionString);
  for (const dayId in daysDefinition) {
    const taskPaths = daysDefinition[dayId];
    for (let i = 0; i < taskPaths.length; i++) {
      const taskPath = taskPaths[i];
      if (taskPath === null || taskPath === undefined || taskPath === "") {
        continue; // Skip empty tasks
      }
      const taskData = loadTask(taskPath);
      const taskNumber = i + 1;

      const task: Task = {
        ...taskData,
        id: taskIdOf(dayId, taskNumber),
        dayId,
        taskNumber,
      };

      if (!daysMap[dayId]) {
        daysMap[dayId] = [];
      }
      daysMap[dayId].push(task);
    }
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
  const fullPath = `./tasks/${pathToTask}.json5`;
  if (!(fullPath in taskModules)) {
    throw new Error(`Task not found at path: ${fullPath}`);
  }
  const codePath = getCodePath(fullPath);
  const startingCode = taskStartingCodes[codePath] as string | undefined;
  const raw = taskModules[fullPath] as string;
  return loadTaskFromString(raw, startingCode);
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

function getCodePath(taskPath: string) {
  return taskPath.replace(/\.json5?$/, ".code");
}
