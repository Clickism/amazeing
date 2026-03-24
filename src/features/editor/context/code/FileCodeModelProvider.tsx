import { CodeModelContext } from "./CodeModelContext.tsx";
import { type PropsWithChildren, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFileStorage } from "../storage/useFileStorage.ts";
import { useMultiSource } from "../source/useMultiSource.ts";
import { SourceTypeContext } from "./SourceTypeContext.tsx";

type FileCodeModelProviderProps = {
  namespace: string;
};

/**
 * Provides a code model that supports multiple files using file storage.
 * The default content and file naming format are localized.
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

  const sourceType = useMemo(
    () => ({
      isMultiSource: true,
    }),
    [],
  );

  return (
    <CodeModelContext.Provider
      value={{
        code: source.activeSource.data,
        setCode: source.activeSource.setData,
        source,
      }}
    >
      <SourceTypeContext.Provider value={sourceType}>
        {children}
      </SourceTypeContext.Provider>
    </CodeModelContext.Provider>
  );
}
