import {
  Button,
  type ButtonProps,
} from "../../../components/ui/Button/Button.tsx";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";

export function CopyToClipboard({
  content,
  ...props
}: { content: string } & ButtonProps) {
  const { t } = useTranslation();
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(content).catch((err) => console.error(err));
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      setTimeoutId(null);
    }, 3000);
    setTimeoutId(id);
  }, [content, timeoutId]);

  return (
    <Button {...props} onClick={copyToClipboard}>
      {timeoutId ? (
        <div style={{ fontWeight: "bold" }}>{t("button.copied")}</div>
      ) : (
        t("button.copyToClipboard")
      )}
    </Button>
  );
}
