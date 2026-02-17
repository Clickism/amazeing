import { LevelContext } from "./LevelContext.tsx";
import { type ReactNode, useEffect, useState } from "react";
import type { Level } from "../../../../core/game/level.ts";

type LevelProviderProps = {
  level: Level;
  children: ReactNode;
};

export function LevelProvider({
  level: initialLevel,
  children,
}: LevelProviderProps) {
  const [level, setLevel] = useState(initialLevel);

  // Reset if initial level changes
  useEffect(() => {
    setLevel(initialLevel);
  }, [initialLevel]);

  return (
    <LevelContext.Provider
      value={{
        level,
        setLevel,
        initialLevel,
      }}
    >
      {children}
    </LevelContext.Provider>
  );
}
