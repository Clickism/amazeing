import { type ButtonProps } from "../../../../shared/components/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";
import { FaCopy } from "react-icons/fa";
import { TimedButton } from "../../../../shared/components/Button/TimedButton/TimedButton.tsx";

export function CopyToClipboard({
  content,
  ...props
}: { content: string } & ButtonProps) {
  const { t } = useTranslation();
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(content).catch((err) => console.error(err));
  }, [content]);

  return (
    <TimedButton onClick={copyToClipboard} {...props}>
      {(active) =>
        active ? (
          <div style={{ fontWeight: "bold" }}>{t("button.copied")}</div>
        ) : (
          <>
            <FaCopy />

            {t("button.copyToClipboard")}
          </>
        )
      }
    </TimedButton>
  );
}
