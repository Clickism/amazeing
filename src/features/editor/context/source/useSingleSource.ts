import type { Source } from "./source.ts";
import { usePersistentStorage } from "../../../../shared/utils/storage.ts";
import { useAutoSave } from "../autosave/useAutoSave.ts";
import { useEffect, useRef, useState } from "react";

export type UseSingleSourceProps<T> = {
  key: string;
  name: string;
  defaultData: T;
  namespace: string;
};

/**
 * Hook to manage a single source of data with auto-saving to persistent storage.
 * @param sourceKey The key to identify the source in storage.
 * @param name The display name of the source, used for UI purposes.
 * @param defaultData The default data to use if there is no stored data for the given key.
 * @param namespace The namespace for the persistent storage, used to avoid key collisions with other sources.
 */
export function useSingleSource<T>({
  key: sourceKey,
  name,
  defaultData,
  namespace,
}: UseSingleSourceProps<T>): Source<T> {
  const storage = usePersistentStorage(namespace);
  const key = `source:${sourceKey}`;
  const [data, setData] = useState<T>(() => {
    const stored = storage.load<T>(key);
    return stored ?? defaultData;
  });

  const { flush } = useAutoSave(() => {
    storage.save(key, data);
  });

  // Handle key changes by flushing current data and loading new data
  const prevKeyRef = useRef(key);
  useEffect(() => {
    if (prevKeyRef.current === key) return;
    flush(); // Save old data before switching
    const stored = storage.load<T>(key) ?? defaultData;
    setData(stored);
    prevKeyRef.current = key;
  }, [defaultData, flush, key, storage]);

  return {
    name,
    data,
    setData,
  };
}
