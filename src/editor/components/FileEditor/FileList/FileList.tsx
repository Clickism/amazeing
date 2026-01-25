import { useSource } from "../../../source/SourceContext.tsx";
import { Button } from "../../../../components/Button/Button.tsx";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { List } from "../../../../components/List/List.tsx";

export function FileList() {
  const { t } = useTranslation();
  const {
    sourceNames,
    name: activeName,
    switchSource,
    newSource,
  } = useSource();
  const fileContainerRef = useRef<HTMLDivElement>(null);
  return (
    <List
      elements={sourceNames ?? []}
      activeElement={activeName}
      onSelectElement={(name) => {
        switchSource?.(name);
      }}
      layoutId="file-list-indicator"
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
