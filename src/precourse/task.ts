import { type LevelData } from "../game/level.ts";
import {
  type PackagedTranslation,
  SUPPORTED_LANGUAGES,
  type Translatable,
} from "../i18n/i18n.ts";

export type TaskData = {
  /**
   * The title (meaningful name) of the task. (i.E: "Getting Started")
   */
  title: Translatable;
  /**
   * The description of the task.
   */
  description: Translatable;
  /**
   * The level data for the task.
   */
  levelData: LevelData;
};

/**
 * Represents a task that can be solved.
 */
export type Task = {
  /**
   * The unique identifier of the task. (i.E: "day1-task1")
   */
  id: string;
  /**
   * The identifier of the day this task belongs to. (i.E: "day1")
   */
  dayId: string;
  /**
   * Task number within the day. (i.E: 1)
   */
  taskNumber: number | null;
} & TaskData;

/**
 * Converts a LevelData object into a JSON string that represents a TaskData object.
 * @param level The LevelData object to convert.
 */
export function stringifyToTask(level: LevelData): string {
  const task: TaskData = {
    title: reorderLanguageKeys(
      level.taskMeta?.title ?? {
        en: "Untitled Task",
        de: "Unbenannte Aufgabe",
      },
    ),
    description: reorderLanguageKeys(
      level.taskMeta?.description ?? {
        en: "No description provided.",
        de: "Keine Beschreibung angegeben.",
      },
    ),
    levelData: {
      ...level,
      taskMeta: undefined,
    },
  };
  return JSON.stringify(task, null, 2);
}

function reorderLanguageKeys(
  translation: PackagedTranslation,
): PackagedTranslation {
  const orderedTranslation: PackagedTranslation = {};
  SUPPORTED_LANGUAGES.forEach((lang) => {
    if (lang in translation) {
      orderedTranslation[lang] = translation[lang];
    }
  });
  return orderedTranslation;
}
