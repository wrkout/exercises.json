import { writeFileSync } from "fs";
import { Exercise } from "../types/exercise";
import { getDirectories, getExercises } from "./builders";

const createJSONFile = (exercises: Array<Exercise>) => {
  writeFileSync(
    "./exercises.json",
    JSON.stringify({ exercises }, null, 2),
    "utf-8"
  );
};

const directories = getDirectories("./exercises");
const exercises = getExercises(directories);
createJSONFile(exercises);
console.log("Created ./exercises.json file");
