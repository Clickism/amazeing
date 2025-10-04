const DEFAULT_THEME: Theme = "light";

export type Theme = "light" | "dark";

export function setTheme(theme: Theme) {
  localStorage.setItem("theme", theme);
}

export function getTheme(): Theme {
  return (localStorage.getItem("theme") as Theme) || DEFAULT_THEME;
}

export function applyCurrentTheme() {
  const theme = getTheme();
  document.documentElement.setAttribute("theme", theme);
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === "light" ? "dark" : "light";
  setTheme(next);
  applyCurrentTheme();
}
