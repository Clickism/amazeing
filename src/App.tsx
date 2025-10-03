import { useState } from "react";
import "./App.css";
import { Interpreter } from "./interpreter/interpreter.ts";

function App() {
  const [code, setCode] = useState("");

  let interpreter: Interpreter | null = null;
  const init = () => {
    interpreter = Interpreter.fromCode(code);
  }

  const handleClick = () => {
    interpreter?.step();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <textarea
        rows={10}
        cols={50}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>
      <button onClick={() => init()}>Init</button>
      <button onClick={() => handleClick()}>Step</button>
    </div>
  );
}

export default App;
