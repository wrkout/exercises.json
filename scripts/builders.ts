import { Dirent, readdirSync } from "fs";
import { Exercise } from "../types/exercise";
import { resolve } from "path";

export const getDirectories = (folder: string): Array<Dirent> => {
  return readdirSync(folder, {
    withFileTypes: true,
  }).filter((dir) => dir.isDirectory());
};

export const getExercises = (directories: Array<Dirent>): Array<Exercise> => {
  return directories.map((dir) => {
    const exercisePath = resolve(`./exercises/${dir.name}/exercise.json`);
    return require(exercisePath);
  });
};
