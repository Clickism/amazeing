import type { ReactNode } from "react";
import { HomePage } from "../pages/HomePage.tsx";
import { SandboxPage } from "../pages/SandboxPage.tsx";
import { LevelEditorPage } from "../pages/LevelEditorPage.tsx";
import type { Translatable } from "../i18n/i18n.ts";

export type Page = {
  path: string;
  title: Translatable;
  element: ReactNode;
  /**
   * Whether to show this page in the Navbar.
   */
  navbar?: boolean;
};

/**
 * List of all pages, linked to Navbar.
 */
export const PAGES: Page[] = [
  {
    path: "/",
    title: { key: "pages.home" },
    element: <HomePage />,
  },
  {
    path: "/sandbox",
    title: { key: "pages.sandbox" },
    element: <SandboxPage />,
    navbar: true,
  },
  {
    path: "/level-editor",
    title: { key: "pages.levelEditor" },
    element: <LevelEditorPage />,
    navbar: true,
  },
];
