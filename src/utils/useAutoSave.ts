import { useCallback, useEffect, useRef } from "react";

const AUTO_SAVE_INTERVAL = 5000; // 5 seconds

export function useAutoSave<T>(
  /**
   * Current content to be saved.
   */
  content: T,
  /**
   * Function to save the content.
   */
  saveContent: (content: T) => void,
  /**
   * Interval for auto-saving in milliseconds. Default is 5000ms (5 seconds).
   */
  saveInterval = AUTO_SAVE_INTERVAL,
): {
  /**
   * Function to manually trigger saving the content.
   * @param content optional content to save, if not provided, latest content will be savv
   */
  saveManually: (content?: T) => void;

  /**
   * Override the last saved content, can be used for manual saving without
   * triggering auto-save on the next interval
   * @param content content to set, or null to clear it
   */
  setLastSavedContent: (content: T | null) => void;
} {
  const contentRef = useRef<T>(content);
  const savedContentRef = useRef<T | null>(null);

  // Keep ref updated
  contentRef.current = content;

  // Save function to check for changes and save the latest content if needed
  const handleSave = useCallback(
    (toSave?: T) => {
      toSave = toSave ?? contentRef.current;
      if (savedContentRef.current === toSave) return;
      saveContent(toSave);
      savedContentRef.current = toSave;
    },
    [saveContent],
  );

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      handleSave();
    }, saveInterval);
    return () => {
      clearInterval(interval);
      handleSave();
    };
  }, [contentRef, handleSave, saveInterval]);

  // Save on close
  useEffect(() => {
    const handleBeforeUnload = () => {
      handleSave();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleSave]);

  const setLastSavedContent = useCallback((content: T | null) => {
    savedContentRef.current = content;
  }, []);

  return {
    saveManually: handleSave,
    setLastSavedContent ,
  };
}
