// Transition
import { DEFAULT_RUN_SPEED } from "./components/Editor/Editor.tsx";

export const TRANSITION_RUN_SPEED_THRESHOLD = 30;
export const DEFAULT_TRANSITION_SPEED = 0.1;
export const MAX_TRANSITION_SPEED = 0.2;

/**
 * Calculates the adjusted transition speed
 */
export function getTransitionSpeed(isRunning: boolean, runSpeed: number) {
  if (!isRunning) {
    return DEFAULT_TRANSITION_SPEED;
  }
  if (runSpeed >= TRANSITION_RUN_SPEED_THRESHOLD) {
    return 0;
  }
  // Between MAX and DEFAULT
  const belowDefault =
    DEFAULT_TRANSITION_SPEED +
    (MAX_TRANSITION_SPEED - DEFAULT_TRANSITION_SPEED) *
      (1 - runSpeed / DEFAULT_RUN_SPEED);
  // Between DEFAULT and 0
  const t =
    (runSpeed - DEFAULT_RUN_SPEED) /
    (TRANSITION_RUN_SPEED_THRESHOLD - DEFAULT_RUN_SPEED);
  const aboveOrAtDefault = DEFAULT_TRANSITION_SPEED * (1 - t);
  // Clamp
  return Math.min(
    MAX_TRANSITION_SPEED,
    runSpeed < DEFAULT_RUN_SPEED ? belowDefault : aboveOrAtDefault,
  );
}

/**
 * Clamps a number between min and max
 * @param value The number to clamp
 * @param min The minimum value
 * @param max The maximum value
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maximum length for a file name
 * @param t
 * @param name
 * @param sourceNames
 * @param currentName
 * @param maxLength
 */
export function checkValidName(
  t: (key: string) => string,
  name: string,
  sourceNames: readonly string[],
  currentName: string,
  maxLength: number = 32,
): [boolean, string | null] {
  if (name.length === 0) {
    return [false, null];
  }
  if (name.length > maxLength) {
    return [false, t("rename.invalid.tooLong")];
  }
  if (name !== currentName && sourceNames.includes(name)) {
    return [false, t("rename.invalid.exists")];
  }
  return [true, null];
}

/**
 * Finds the next name in the list after removing the current name.
 *
 * Should be called before actually removing the current name from the source names.
 * @param currentName The name to remove and find the next name for.
 * @param sourceNames The list of source names to find the next name from.
 */
export function findNextName(
  currentName: string,
  sourceNames: readonly string[],
): string | null {
  const idx = sourceNames.indexOf(currentName);
  const newNames = sourceNames.filter((_, i) => i !== idx);
  if (idx == -1) {
    throw new Error("Current name not found in source names");
  }
  if (newNames.length > 0) {
    return newNames[Math.max(0, idx - 1)];
  }
  return null;
}

export function findNextAvailableName(
  nameFn: (num: number) => string,
  existingNames: readonly string[],
  startNum: number = 1,
): string {
  let num = startNum;
  while (existingNames.includes(nameFn(num))) {
    num++;
  }
  return nameFn(num);
}
