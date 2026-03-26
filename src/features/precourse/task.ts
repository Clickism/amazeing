import type { Constraint } from "../../core/game/constraints.ts";
import { type LevelData } from "../../core/game/level.ts";
import {
  type PackagedTranslation,
  SUPPORTED_LANGUAGES,
} from "../../shared/i18n/i18n.ts";
import JSON5 from "json5";
import type { MazeData } from "../../core/game/maze.ts";

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
  /**
   * Optional constraints for the task.
   *
   * Constraints are used to add additional requirements to the task, such as a maximum instruction count.
   */
  constraints?: Constraint[];
  /**
   * Whether the solution can be verified by the user themselves.
   * If set to true, the user can click a button to mark their solution as correct.
   */
  selfChecked?: boolean;
  /**
   * Maximum number of steps for the interpreter to solve this task in
   */
  maxSteps?: number;
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
  const walls = {
    horizontal: encode2DBooleanArray(level.maze.walls.horizontal),
    vertical: encode2DBooleanArray(level.maze.walls.vertical),
  };
  const task: UnparsedTaskData = {
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
      maze: {
        ...level.maze,
        walls,
      },
      taskMeta: undefined,
    },
  };

  return JSON5.stringify(task, null, 2);
}

/**
 * Stringifies to ready-to-copy levelData one-liner.
 * @param level The LevelData object to convert.
 */
export function stringifyToLevelData(level: LevelData): string {
  const walls = {
    horizontal: encode2DBooleanArray(level.maze.walls.horizontal),
    vertical: encode2DBooleanArray(level.maze.walls.vertical),
  };
  const levelData = {
    ...level,
    maze: {
      ...level.maze,
      walls,
    },
    taskMeta: undefined,
  };
  const json = JSON5.stringify(levelData, null, 2);
  return "levelData: " + json;
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

type UnparsedTaskData = Omit<Omit<TaskData, "levelData">, "startingCode"> & {
  levelData: Omit<LevelData, "maze"> & {
    maze: Omit<MazeData, "walls"> & {
      walls: {
        horizontal: string;
        vertical: string;
      };
    };
  };
};

/**
 * Loads a task from a JSON5 string.
 * @param json json to parse
 * @param startingCode starting code of the task
 */
export function loadTaskFromString(
  json: string,
  startingCode: string | undefined,
): TaskData {
  const parsed = JSON5.parse(json) as UnparsedTaskData;
  const horizontalWalls = parsed.levelData.maze.walls.horizontal;
  const verticalWalls = parsed.levelData.maze.walls.vertical;
  return {
    ...parsed,
    levelData: {
      ...parsed.levelData,
      maze: {
        ...parsed.levelData.maze,
        walls: {
          horizontal: decode2DBooleanArray(horizontalWalls),
          vertical: decode2DBooleanArray(verticalWalls),
        },
      },
    },
    startingCode,
  };
}

// We Encode walls as strings to declutter json
function encode2DBooleanArray(array: boolean[][]): string {
  return array
    .map((row) => row.map((value) => (value ? "1" : "0")).join(""))
    .join("-");
}

function decode2DBooleanArray(array: string) {
  return array
    .split("-")
    .map((row) => row.split("").map((char) => char === "1"));
}
