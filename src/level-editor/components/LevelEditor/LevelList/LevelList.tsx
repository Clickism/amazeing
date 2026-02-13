import { Button } from "../../../../components/Button/Button.tsx";
import {
  emptyLevelData,
  type LevelEditorDispatch,
  type LevelEditorState,
} from "../../../state.ts";
import { List } from "../../../../components/List/List.tsx";
import { useLevelStorage } from "../../../storage/LevelStorageContext.tsx";
import { useTranslation } from "react-i18next";

type LevelListProps = {
  editor: LevelEditorState;
  dispatch: LevelEditorDispatch;
};

export function LevelList({ editor, dispatch }: LevelListProps) {
  const { t } = useTranslation();
  const { levelNames, loadLevel, saveLevel } = useLevelStorage();
  return (
    <List
      elements={levelNames.map((name) => ({ id: name, name }))}
      activeElementId={editor.level.name}
      onSelectElement={(name) => {
        const selectedLevel = loadLevel(name);
        if (selectedLevel) {
          dispatch({ type: "setLevel", level: selectedLevel });
        }
      }}
    >
      <Button
        onClick={() => {
          let i = 1;
          let newName: string;
          do {
            newName = t("levelStorage.newLevel.name", { num: i++ });
          } while (levelNames.includes(newName));
          const level = emptyLevelData(
            newName,
            t("levelStorage.newLevel.description"),
          );
          saveLevel(level);
          dispatch({ type: "setLevel", level });
        }}
      >
        + New Level
      </Button>
    </List>
  );
}
