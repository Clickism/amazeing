import { Fragment, type ReactNode } from "react";
import { QuotedText } from "../../../../../../shared/components/QuotedText/QuotedText.tsx";
import styles from "./TaskDescription.module.css";
import { IoIosBulb, IoIosWarning } from "react-icons/io";
import clsx from "clsx";
import { IconText } from "../../../../../../shared/components/IconText/IconText.tsx";
import {
  Collapsable,
  type CollapsableProps,
} from "../../../../../../shared/components/Collapsable/Collapsable.tsx";
import type { Translator } from "../../../../../../shared/i18n/i18n.ts";
import { useTranslation } from "react-i18next";
import { IoInformationCircleOutline } from "react-icons/io5";

type TaskDescriptionProps = {
  description: string;
};

export function TaskDescription({ description }: TaskDescriptionProps) {
  const { t } = useTranslation();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(
    `<root>${description}</root>`,
    "text/xml",
  );
  const root = xmlDoc.documentElement;
  return (
    <div>
      {Array.from(root.childNodes).map((child, index) =>
        renderNode(child, index, t),
      )}
    </div>
  );
}

function renderNode(node: ChildNode, key: number, t: Translator): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return <QuotedText key={key} text={node.textContent ?? ""} />;
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;
    const tag = el.tagName.toLowerCase() as Tag;
    const children = Array.from(el.childNodes).map((child, index) =>
      renderNode(child, index, t),
    );
    const renderer = rendererOf(tag);
    return <Fragment key={key}>{renderer(children, el, t)}</Fragment>;
  }
}

type Tag = "hint" | "remark" | "warn" | "br" | "ol" | "li";
type TagRenderer = (
  children: ReactNode[],
  el: Element,
  t: Translator,
) => ReactNode;

/**
 * Renderers for each tag.
 *
 * Attribute "hidden" makes the tag collapsable and hidden by default.
 *
 * Available tags:
 * - hint (attributes: hidden): Formats as remark
 * - remark (attributes: hidden): Formats as remark
 * - br: Line break
 */
const renderers: Partial<Record<Tag, TagRenderer>> = {
  hint: collapsable(
    (t) => ({
      title: t("taskDescription.hint"),
      color: "var(--text-color-t60)",
    }),
    (children) => (
      <IconText
        icon={<IoIosBulb size={16} />}
        top="3px"
        className={clsx(styles["tag-hint"])}
      >
        <div>{children}</div>
      </IconText>
    ),
  ),
  remark: collapsable(
    (t) => ({
      title: t("taskDescription.remark"),
      color: "var(--text-color-t60)",
    }),
    (children) => (
      <IconText
        icon={<IoInformationCircleOutline size={16} />}
        top="3px"
        className={clsx(styles["tag-remark"])}
      >
        <div>{children}</div>
      </IconText>
    ),
  ),
  warn: collapsable(
    (t) => ({
      title: t("taskDescription.warn"),
      color: "var(--clr-warning-a10)"
    }),
    (children) => (
      <IconText
        icon={<IoIosWarning size={16} />}
        top="3px"
        className={clsx(styles["tag-warn"])}
      >
        <div>{children}</div>
      </IconText>
    ),
  ),
  br: () => <br />,
  ol: (children) => <ol className={styles["tag-ol"]}>{children}</ol>,
  li: (children) => <li className={styles["tag-li"]}>{children}</li>,
};

function rendererOf(tag: Tag): TagRenderer {
  return renderers[tag] ?? defaultRenderer(tag);
}

function collapsable(
  props: (
    t: Translator,
  ) => Partial<Exclude<CollapsableProps, "title">> &
    Pick<CollapsableProps, "title">,
  renderer: TagRenderer,
): TagRenderer {
  return (children, el, t) =>
    el.getAttribute("hidden") === "true" ? (
      <>
        <div style={{ marginTop: "8px" }} />
        <Collapsable {...props(t)}>{renderer(children, el, t)}</Collapsable>
      </>
    ) : (
      renderer(children, el, t)
    );
}

function defaultRenderer(tag: Tag): TagRenderer {
  return (children) => <div className={styles[`tag-${tag}`]}>{children}</div>;
}
