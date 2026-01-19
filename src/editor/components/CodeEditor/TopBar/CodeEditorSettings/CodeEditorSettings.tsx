import { Button } from "../../../../../components/Button/Button.tsx";
import styles from "../../CodeEditor.module.css";
import { VscSettings } from "react-icons/vsc";
import { FormGroup } from "../../../../../components/Form/FormGroup/FormGroup.tsx";
import { FormField } from "../../../../../components/Form/FormField/FormField.tsx";
import { ThemeSelect } from "../../ThemeSelect/ThemeSelect.tsx";
import { Popover } from "../../../../../components/popup/Popover/Popover.tsx";
import { useTranslation } from "react-i18next";
import { useCodeEditorSettings } from "../../../../settings/CodeEditorSettingsContext.tsx";

export function CodeEditorSettings() {
  const { t } = useTranslation();
  const { settings, setSettings } = useCodeEditorSettings();
  return (
    <Popover
      title={t("codeEditor.settings")}
      trigger={
        <Button shape="icon" className={styles.settingsButton}>
          <VscSettings size={20} />
        </Button>
      }
    >
      <FormGroup>
        <FormField label={t("codeEditor.theme")}>
          <ThemeSelect />
        </FormField>
        <FormField label={t("codeEditor.fontSize")}>
          <input
            type="number"
            min={8}
            max={32}
            defaultValue={settings.fontSize}
            onChange={(e) => {
              const size = Number(e.target.value);
              setSettings({
                ...settings,
                fontSize: size,
              });
            }}
          />
        </FormField>
      </FormGroup>
    </Popover>
  );
}
