import { useCallback, useEffect, useRef } from "react";

const DEFAULT_DELAY = 1000; // 1000ms

export type AutoSave = {
  /**
   * Manually trigger saving the content.
   */
  flush: () => void;
};

export function useAutoSave<T>(
  data: T,
  onSave: () => void,
  delay = DEFAULT_DELAY,
): AutoSave {
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Stable flush function
  const flush = useCallback(() => {
    onSaveRef.current();
  }, []);

  // Set up debounced auto-saving
  useEffect(() => {
    const id = setTimeout(flush, delay);
    return () => {
      clearTimeout(id);
    };
  }, [flush, delay, data]);

  // Save before unload
  useEffect(() => {
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [flush]);

  return { flush };
}
