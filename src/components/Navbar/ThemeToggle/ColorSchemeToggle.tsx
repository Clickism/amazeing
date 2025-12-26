import { BiMoon } from "react-icons/bi";
import { ImSun } from "react-icons/im";
import { useColorScheme } from "../../../theme/ColorSchemeContext.tsx";
import { Button } from "../../Button/Button.tsx";

export default function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  return (
    <Button
      shape="icon"
      onClick={() => {
        setColorScheme(colorScheme === "light" ? "dark" : "light");
      }}
      variant="transparent"
    >
      {colorScheme === "light" ? <ImSun size={20} /> : <BiMoon size={20} />}
    </Button>
  );
}
