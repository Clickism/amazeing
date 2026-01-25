import { Button } from "../../../../components/Button/Button.tsx";
import {
  createInitialEditorState,
  type LevelEditorDispatch,
  type LevelEditorState,
} from "../../../state.ts";
import { List } from "../../../../components/List/List.tsx";
import { useLevelStorage } from "../../../../game/storage/LevelStorageContext.tsx";
import { useTranslation } from "react-i18next";

type LevelListProps = {
  editor: LevelEditorState;
  dispatch: LevelEditorDispatch;
};

export function LevelList({ editor, dispatch }: LevelListProps) {
  const { t } = useTranslation();
  const { levelNames, loadLevel, addLevel } = useLevelStorage();
  return (
    <List
      elements={levelNames}
      activeElement={editor.name}
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
          addLevel(createInitialEditorState(newName));
        }}
      >
        + New Level
      </Button>
    </List>
  );
}
