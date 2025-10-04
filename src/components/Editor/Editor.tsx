import { CodeEditor } from "../CodeEditor/CodeEditor.tsx";
import { Console } from "../Console/Console.tsx";
import { Viewport } from "../Viewport/Viewport.tsx";
import styles from "./Editor.module.css";

export function Editor() {
  return (
    <div className={styles.editorContainer}>
      <div className={styles.left}>
        <div className={styles.viewport}>
          <Viewport />
        </div>
        <div className={styles.console}>
          <Console />
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.codeEditor}>
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}
