import { Route } from "react-router";
import { Routes } from "react-router-dom";
import { PAGES } from "./pages.tsx";

export function AppRoutes() {
  return (
    <Routes>
      {PAGES.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}
    </Routes>
  );
}
