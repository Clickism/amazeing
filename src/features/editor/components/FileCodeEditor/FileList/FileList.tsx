import { Button } from "../../../../../shared/components/Button/Button.tsx";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { List } from "../../../../../shared/components/List/List.tsx";
import { type MultiSource } from "../../../context/source/source.ts";

type FileListProps<T> = {
  source: MultiSource<T>;
};

export function FileList<T>({ source }: FileListProps<T>) {
  const { t } = useTranslation();
  const {
    activeSource: { name: activeName },
    sourceNames,
    switchSource,
    newSource,
  } = source;
  const fileContainerRef = useRef<HTMLDivElement>(null);
  return (
    <List
      elements={sourceNames?.map((name) => ({ id: name, name })) ?? []}
      activeElementId={activeName}
      onSelectElement={(name) => {
        switchSource?.(name);
      }}
      layoutId="file-list-indicator"
      style={{
        // Keep same as level editor list for consistency
        minWidth: "210px",
      }}
    >
      <Button
        onClick={() => {
          newSource?.();
          const container = fileContainerRef.current;
          if (!container) return;
          container.scrollTop = container.scrollHeight;
        }}
      >
        + {t("fileList.newFile")}
      </Button>
    </List>
  );
}
