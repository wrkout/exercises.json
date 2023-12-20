import { readdirSync, Dirent, writeFileSync } from "fs";
import { resolve, join } from "path";
import { Exercise } from "../types/exercise";

const getDirectories = (folder: string): Array<Dirent> => {
  const subFolders = readdirSync(folder, {
    withFileTypes: true,
  }).filter((dir) => dir.isDirectory());

  return subFolders;
};

const getExercises = (directories: Array<Dirent>): Array<Exercise> => {
  return directories.map((dir) => {
    const exercisePath = resolve(`./exercises/${dir.name}/exercise.json`);
    const imagesFolderPath = resolve(`./exercises/${dir.name}/images/`);
    const imageFiles = readdirSync(imagesFolderPath).map((file) =>
      join(imagesFolderPath, file)
    ); // Get paths for all images
    const exercise = require(exercisePath);
    exercise.imagePaths = imageFiles; // Add the image paths array to the exercise object
    return exercise;
  });
};

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
