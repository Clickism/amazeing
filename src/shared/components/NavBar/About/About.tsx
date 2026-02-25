import { Popover } from "../../../floating/Popover/Popover.tsx";
import { Button } from "../../Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoIosHelpCircleOutline } from "react-icons/io";

export function About() {
  const { t } = useTranslation();
  return (
    <Popover
      title={t("about.tooltip")}
      trigger={
        <Button variant="linky" shape="icon">
          <IoIosHelpCircleOutline size={24} />
        </Button>
      }
    >
      <div className="fancy-headers" style={{ maxWidth: "300px" }}>
        <h6>{t("about.developedBy")}</h6>
        Yağız Aktaş{" "}
        <a
          href="https://github.com/Clickism"
          target="_blank"
          rel="noopener noreferrer"
        >
          (Clickism <FaExternalLinkAlt size={12} />)
        </a>
        <h6>{t("about.helpOf")}</h6>
        {t("about.tutors")}
        <h6>{t("about.sourceCode")} </h6>
        <a
          href="https://github.com/Clickism/amazeing"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <FaExternalLinkAlt size={12} />
        </a>
      </div>
    </Popover>
  );
}
