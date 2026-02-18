import { useCallback, useEffect, useRef } from "react";

const DEFAULT_DELAY = 1000; // 1000ms

export type AutoSave = {
  /**
   * Manually trigger saving the content.
   */
  flush: () => void;
  /**
   * Cancels any pending auto-save operations.
   */
  cancel: () => void;
};

/**
 * Hook to automatically save data with a delay that resets on each change
 * to the data, and also before the website is unloaded.
 * @param data
 * @param onSave
 * @param delay
 */
export function useAutoSave<T>(
  data: T,
  onSave: () => void,
  delay = DEFAULT_DELAY,
): AutoSave {
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  const timeoutRef = useRef<number | null>(null);

  // Stable flush function
  const flush = useCallback(() => {
    onSaveRef.current();
  }, []);

  // Stable cancel function
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Set up debounced auto-saving
  useEffect(() => {
    timeoutRef.current = setTimeout(flush, delay);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [flush, delay, data]);

  // Save before unload
  useEffect(() => {
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [flush]);

  return { flush, cancel };
}
