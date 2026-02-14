import { Button } from "../../../../components/Button/Button.tsx";
import { List } from "../../../../components/List/List.tsx";
import { useLevelSource } from "../../../../editor/source/SourceContext.tsx";

export function LevelList() {
  const { name, sourceNames, switchSource, newSource } = useLevelSource();
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
        + New Level
      </Button>
    </List>
  );
}
