import { BiMoon } from "react-icons/bi";
import { ImSun } from "react-icons/im";
import { useColorScheme } from "../../../theme/ColorSchemeContext.tsx";
import { Button } from "../../Button/Button.tsx";
import { Tooltip } from "../../popup/Tooltip/Tooltip.tsx";
import { useTranslation } from "react-i18next";

export default function ColorSchemeToggle() {
  const { t } = useTranslation();
  const { colorScheme, setColorScheme } = useColorScheme();
  return (
    <Tooltip content={t("colorScheme.toggle")}>
      <Button
        shape="icon"
        onClick={() => {
          setColorScheme(colorScheme === "light" ? "dark" : "light");
        }}
        variant="transparent"
      >
        {colorScheme === "light" ? <ImSun size={20} /> : <BiMoon size={20} />}
      </Button>
    </Tooltip>
  );
}
