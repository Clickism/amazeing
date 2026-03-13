import { extractQuotedText } from "../../utils/utils.ts";
import type { HTMLAttributes } from "react";

export type QuotedTextProps = {
  text: string;
  decorator?: (text: string) => HTMLAttributes<HTMLSpanElement>;
};

const defaultDecorator = () => ({ className: "quoted-code" });

export function QuotedText({
  text,
  decorator = defaultDecorator,
}: QuotedTextProps) {
  const parts = extractQuotedText(text);
  return (
    <>
      {parts.map((part, i) =>
        part.quoted ? (
          <span key={i} {...decorator(part.text)}>
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}
