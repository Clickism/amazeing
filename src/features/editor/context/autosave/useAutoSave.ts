import { useCallback, useEffect, useRef } from "react";

const DEFAULT_INTERVAL = 5000; // 5 seconds

export type AutoSave = {
  /**
   * Manually trigger saving the content.
   */
  flush: () => void;
};

export function useAutoSave(
  onSave: () => void,
  interval = DEFAULT_INTERVAL,
): AutoSave {
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Stable flush function
  const flush = useCallback(() => {
    onSaveRef.current();
  }, []);

  // Save periodically
  useEffect(() => {
    const id = setInterval(flush, interval);
    return () => {
      clearInterval(id);
      flush();
    };
  }, [flush, interval]);

  // Save before unload
  useEffect(() => {
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [flush]);

  return { flush };
}
