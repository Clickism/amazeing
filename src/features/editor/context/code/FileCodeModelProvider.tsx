import { CodeModelContext } from "./CodeModelContext.tsx";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { useFileStorage } from "../storage/useFileStorage.ts";
import { useMultiSource } from "../source/useMultiSource.ts";

type FileCodeModelProviderProps = {
  namespace: string;
};

/**
 * Provides a code model that supports multiple files using file storage.
 * The default content and file naming format are localized.
 *
 * @param namespace The namespace for the file storage, used to isolate files for different contexts.
 * @param children The child components that will have access to the code model context.
 */
export function FileCodeModelProvider({
  namespace,
  children,
}: PropsWithChildren<FileCodeModelProviderProps>) {
  const { t } = useTranslation();
  const fileStorage = useFileStorage<string>(namespace);

  const source = useMultiSource<string>({
    defaultData: t("codeStorage.newFile.content"),
    fileStorage,
    fileNameFormat: (num) => t("codeStorage.newFile.name", { num }),
  });

  return (
    <CodeModelContext.Provider
      value={{
        code: source.activeSource.data,
        setCode: source.activeSource.setData,
        source,
      }}
    >
      {children}
    </CodeModelContext.Provider>
  );
}
