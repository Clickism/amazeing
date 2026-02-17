import { Button } from "../../../../../shared/components/Button/Button.tsx";
import { List } from "../../../../../shared/components/List/List.tsx";
import { useTranslation } from "react-i18next";
import { useLevelEditor } from "../../../context/LevelEditorContext.tsx";

export function LevelList() {
  const {
    source: {
      activeSource: { name },
      sourceNames,
      switchSource,
      newSource,
    },
  } = useLevelEditor();
  const { t } = useTranslation();
  return (
    <List
      elements={sourceNames?.map((name) => ({ id: name, name })) ?? []}
      activeElementId={name}
      onSelectElement={(name) => {
        switchSource(name);
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
