import { Button } from "../../../../../shared/components/Button/Button.tsx";
import { List } from "../../../../../shared/components/List/List.tsx";
import { useLevelSource } from "../../../../editor/source/SourceContext.tsx";
import { useTranslation } from "react-i18next";

export function LevelList() {
  const { name, sourceNames, switchSource, newSource } = useLevelSource();
  const { t } = useTranslation();
  return (
    <List
      elements={sourceNames?.map((name) => ({ id: name, name })) ?? []}
      activeElementId={name}
      onSelectElement={(name) => {
        switchSource?.(name);
      }}
    >
      <Button
        onClick={() => {
          newSource?.();
        }}
      >
        + {t("levelList.newLevel")}
      </Button>
    </List>
  );
}
