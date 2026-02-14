import { emptyLevelData } from "../../../state.ts";
import { ButtonGroup } from "../../../../components/Button/ButtonGroup/ButtonGroup.tsx";
import { Button } from "../../../../components/Button/Button.tsx";
import { CopyToClipboard } from "../../CopyToClipboard/CopyToClipboard.tsx";
import { useTranslation } from "react-i18next";
import { BiExport } from "react-icons/bi";
import { Modal } from "../../../../components/floating/Modal/Modal.tsx";
import { useLevelSource } from "../../../../editor/source/SourceContext.tsx";

// TODO: Refactor
export function ExportPanel({
  visualize,
  setVisualize,
}: {
  visualize: boolean;
  setVisualize: (visualize: boolean) => void;
}) {
  const { t } = useTranslation();
  const { source, setSource: setLevel } = useLevelSource();
  const editorStateJSON = JSON.stringify(source);

  return (
    <>
      {/*<h5>{t("levelEditor.headers.metadata")}</h5>*/}
      {/*<FormField label={t("levelEditor.export.levelTitle")}>*/}
      {/*  <input*/}
      {/*    type="text"*/}
      {/*    value={editor.level.title}*/}
      {/*    onChange={(e) => {*/}
      {/*      dispatch({*/}
      {/*        type: "setMetadata",*/}
      {/*        name: currentLevelName,*/}
      {/*        title: e.target.value,*/}
      {/*        description: editor.level.description,*/}
      {/*      });*/}
      {/*    }}*/}
      {/*    style={{*/}
      {/*      width: "200px",*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</FormField>*/}

      {/*<FormField label={t("levelEditor.export.levelDescription")}>*/}
      {/*  <textarea*/}
      {/*    value={editor.level.description}*/}
      {/*    onChange={(e) => {*/}
      {/*      dispatch({*/}
      {/*        type: "setMetadata",*/}
      {/*        name: currentLevelName,*/}
      {/*        title: editor.level.title,*/}
      {/*        description: e.target.value,*/}
      {/*      });*/}
      {/*    }}*/}
      {/*    style={{*/}
      {/*      height: "100px",*/}
      {/*      width: "200px",*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</FormField>*/}

      <h5>{t("levelEditor.headers.actions")}</h5>

      <ButtonGroup vertical stretch>
        <Button variant="success" onClick={() => setVisualize(!visualize)}>
          {visualize
            ? t("levelEditor.export.actions.editMaze")
            : t("levelEditor.export.actions.visualizeMaze")}
        </Button>
        <Modal
          // TODO: Translate
          title={t("levelEditor.export.actions.exportJSON.modal")}
          trigger={
            <Button variant="secondary">
              {t("levelEditor.export.actions.exportJSON")}
              <BiExport />
            </Button>
          }
        >
          <textarea
            readOnly
            value={editorStateJSON}
            style={{
              height: "200px",
            }}
          />
          <CopyToClipboard content={editorStateJSON} />
        </Modal>

        <Button
          variant="danger"
          onClick={() => {
            setLevel(emptyLevelData());
          }}
        >
          {t("levelEditor.export.actions.reset")}
        </Button>
      </ButtonGroup>
    </>
  );
}
