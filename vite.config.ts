import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as child from "child_process";

const commitHash = child
  .execSync("git rev-parse --short HEAD")
  .toString()
  .trim();

// https://vite.dev/config/
export default defineConfig({
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [react()],
});
