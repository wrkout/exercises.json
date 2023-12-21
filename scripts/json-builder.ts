import { readdirSync, Dirent, writeFileSync } from "fs";
import { resolve, join } from "path";
import { Exercise } from "../types/exercise";
import { createHash } from "crypto";
import version from "../version-control.json";

const getDirectories = (folder: string): Array<Dirent> => {
  const subFolders = readdirSync(folder, {
    withFileTypes: true,
  }).filter((dir) => dir.isDirectory());

  return subFolders;
};

const createHashFromName = (name: string): string => {
  return createHash("sha256").update(name).digest("hex");
};

const getExercises = (directories: Array<Dirent>): Array<Exercise> => {
  return directories.map((dir) => {
    const exercisePath = resolve(`./exercises/${dir.name}/exercise.json`);
    const imagesFolderPath = resolve(`./exercises/${dir.name}/images/`);
    const remoteUrl = `https://storage.googleapis.com/aitrainer_exercises/${dir.name}/images/`;
    const imageFiles = readdirSync(imagesFolderPath).map(
      (file) => remoteUrl + file
    ); // Get paths for all images
    const exercise = require(exercisePath);
    exercise.id = createHashFromName(exercise.name);

    exercise.imagePaths = imageFiles; // Add the image paths array to the exercise object
    return exercise;
  });
};

const createJSONFile = (exercises: Array<Exercise>) => {
  writeFileSync(
    "./exercises.json",
    JSON.stringify({ version: version.version, exercises }, null, 2),
    "utf-8"
  );
};

const directories = getDirectories("./exercises");
const exercises = getExercises(directories);
createJSONFile(exercises);
console.log("Created ./exercises.json file");
