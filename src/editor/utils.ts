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
