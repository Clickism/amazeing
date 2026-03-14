import fs from "fs";
import path from "path";
import JSON5 from "json5";

// CHANGE AS NEEDED
const ROOT = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  "src/features/precourse/tasks/sandbox",
);
const DELETE_ORIGINAL = false;

function encode2DBooleanArray(array) {
  return array.map((row) => row.map((v) => (v ? "1" : "0")).join("")).join("-");
}

function encodeWalls(task) {
  const walls = task?.levelData?.maze?.walls;
  if (!walls) return;

  if (Array.isArray(walls.horizontal)) {
    task.levelData.maze.walls.horizontal = encode2DBooleanArray(
      walls.horizontal,
    );
  }

  if (Array.isArray(walls.vertical)) {
    task.levelData.maze.walls.vertical = encode2DBooleanArray(walls.vertical);
  }
}

// Increment task0 to task1 in the filename
function incrementTaskFileName(filePath) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, ".json"); // e.g., task0
  const match = base.match(/^task(\d+)$/);

  if (match) {
    const num = parseInt(match[1], 10) + 1;
    return path.join(dir, `task${num}.json5`);
  }

  return path.join(dir, base + ".json5");
}

function convertFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const task = JSON5.parse(text);

  encodeWalls(task);

  let json5 = JSON5.stringify(task, null, 2);
  json5 = json5.replace(/\\n/g, " \\\n      ");

  const newPath = incrementTaskFileName(filePath);
  fs.writeFileSync(newPath, json5, "utf8");

  console.log(`Converted ${filePath} -> ${newPath}`);

  if (DELETE_ORIGINAL) {
    fs.unlinkSync(filePath);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      walk(full);
    } else if (full.endsWith(".json")) {
      convertFile(full);
    }
  }
}

walk(ROOT);

console.log("Done.");
