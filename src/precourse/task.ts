import type { LevelData } from "../game/level.ts";
import type { Translatable } from "../i18n/i18n.ts";

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
  taskNumber: number;
} & TaskData;
