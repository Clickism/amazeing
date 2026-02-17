/**
 * A readonly {@link Source}.
 */
export type ReadonlySource<T> = {
  name: string;
  data: T;
};

/**
 * A source is a data provider that can be used to provide data to the (level)
 * editor, such as the level data, the code, etc.
 */
export type Source<T> = ReadonlySource<T> & {
  setData: (data: T) => void;
};

/**
 * A multi-source is a collection of sources that can be switched between.
 */
export type MultiSource<T> = {
  activeSource: Source<T>;
  sourceNames: readonly string[];
  switchSource: (name: string) => void;
  renameSource: (newName: string) => void;
  deleteSource: () => void;
  newSource: () => void;
};

/**
 * Checks if the given source is a multi-source.
 * @param source The source to check
 */
export function isMultiSource<T>(
  source: Source<T> | MultiSource<T>,
): source is MultiSource<T> {
  return "activeSource" in source;
}
