import * as React from "react";
import { Navbar } from "./Navbar/Navbar.tsx";
import "./Layout.module.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
