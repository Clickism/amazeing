import type { LevelData } from "../game/level.ts";

export type Task = {
  /**
   * The unique identifier of the task. (i.E: "d1-1")
   */
  id: string;
  /**
   * The name of the task. (i.E: "D1.1")
   */
  name: string;
  /**
   * The title (meaningful name) of the task.
   */
  title: string;
  /**
   * The description of the task.
   */
  description: string;

  /**
   * The level data for the task.
   */
  levelData: LevelData;
};
