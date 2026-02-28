import { type LevelData } from "../../core/game/level.ts";
import {
  type PackagedTranslation,
  SUPPORTED_LANGUAGES,
} from "../../shared/i18n/i18n.ts";

export type TaskData = {
  /**
   * The title (meaningful name) of the task. (i.E: "Getting Started")
   */
  title: PackagedTranslation;
  /**
   * The description of the task.
   */
  description: PackagedTranslation;
  /**
   * The level data for the task.
   */
  levelData: LevelData;
  /**
   * Optional starting code for the task.
   *
   * Can be used to provide a template or partial solution.
   */
  startingCode?: string;
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
    startingCode: level.taskMeta?.startingCode,
  };
  // Hacky but makes json more readable, WILL break if we have any other boolean
  // values in the data but we don't for now
  let json = JSON.stringify(task, null, 2);
  json = json.replace(/\b(true|false)\b,\n\s*/g, "$1, ");
  json = json.replace(/\b(true|false)\b\n\s*/g, "$1");
  json = json.replace(/\[\n\s*(true|false)/g, "[$1");
  return json;
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
