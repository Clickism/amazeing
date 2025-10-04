import { Route } from "react-router";
import { Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage.tsx";
import { SandboxPage } from "../pages/SandboxPage.tsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sandbox" element={<SandboxPage />} />
    </Routes>
  );
}
