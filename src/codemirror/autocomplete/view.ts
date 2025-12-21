import type { Documentation } from "../documentation/documentation.ts";
import { classHighlighter, highlightCode } from "@lezer/highlight";
import { docLanguage } from "./docLanguage.ts";

export function getCompletionNode(doc: Documentation) {
  const docs = Array.isArray(doc) ? doc : [doc];
  const container = document.createElement("div");
  container.className = "documentation";
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    container.appendChild(getUsageElement(doc.usage));
    container.appendChild(getTextElement(doc.description, "description"));
    if (doc.warning) {
      container.appendChild(getTextElement(doc.warning, "warning"));
    }
    // Add separator
    if (i < docs.length - 1) {
      const separator = document.createElement("div");
      separator.className = "separator";
      container.appendChild(separator);
    }
  }
  return container;
}

function getUsageElement(code: string) {
  const usage = document.createElement("pre");
  usage.className = "usage";

  const putText = (text: string, classes: string) => {
    let node: Node = document.createTextNode(text);
    if (classes) {
      const span = document.createElement("span");
      span.appendChild(node);
      span.className = classes;
      node = span;
    }
    usage.appendChild(node);
  };

  const putBreak = () => {
    usage.appendChild(document.createTextNode("\n"));
  };

  highlightCode(
    code,
    docLanguage.parser.parse(code),
    classHighlighter,
    putText,
    putBreak,
  );

  return usage;
}

function getTextElement(text: string, className: string) {
  const elem = document.createElement("div");
  elem.className = className;

  const parts = text.split(/(".*?")/g);
  for (const part of parts) {
    if (part.startsWith('"') && part.endsWith('"')) {
      const span = document.createElement("span");
      span.className = "quoted";
      span.textContent = part.slice(1, -1);
      elem.appendChild(span);
    } else {
      elem.appendChild(document.createTextNode(part));
    }
  }

  return elem;
}
