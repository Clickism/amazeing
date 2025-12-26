import {useCallback, useMemo, useState} from "react";

/**
 * Wrapper around localStorage for namespaced persistent storage.
 */
export class PersistentStorage {
  readonly namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  load(key: string): string | null {
    return localStorage.getItem(this.keyOf(key));
  }

  loadNumber(key: string, defaultValue: number | null = null): number | null {
    const value = this.load(key);
    if (value === null) return defaultValue;
    const number = Number(value);
    return Number.isNaN(number) ? defaultValue : number;
  }

  loadBoolean(
    key: string,
    defaultValue: boolean | null = null,
  ): boolean | null {
    const value = this.load(key);
    return value !== null ? value === "true" : defaultValue;
  }

  loadObject<T>(key: string): T | null;
  loadObject<T>(key: string, defaultValue: T): T;
  loadObject<T>(key: string, defaultValue: T | null = null): T | null {
    const value = this.load(key);
    if (value === null) return defaultValue;
    try {
      return JSON.parse(value) as T;
    } catch {
      return defaultValue;
    }
  }

  save<T>(key: string, value: T): void {
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);
    localStorage.setItem(this.keyOf(key), stringValue);
  }

  remove(key: string): void {
    localStorage.removeItem(this.keyOf(key));
  }

  clear(): void {
    const prefix = this.keyOf("");
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    }
  }

  private keyOf(key: string): string {
    return this.namespace + ":" + key;
  }
}

/**
 * React hook for persistent state using PersistentStorage.
 * @param storage The PersistentStorage instance to use.
 * @param key The key to store the state under
 * @param defaultValue The default value.
 */
export function usePersistentState<T>(
  storage: PersistentStorage,
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() =>
    storage.loadObject<T>(key, defaultValue),
  );

  const setPersistentState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next =
          typeof value === "function" ? (value as (p: T) => T)(prev) : value;
        storage.save(key, next);
        return next;
      });
    },
    [storage, key],
  );

  return [state, setPersistentState];
}

/**
 * React hook to create a PersistentStorage instance.
 * @param namespace The namespace for the storage.
 */
export function usePersistentStorage(namespace: string): PersistentStorage {
  return useMemo(() => new PersistentStorage(namespace), [namespace]);
}
