import { Storage } from "@google-cloud/storage";
import { readdirSync } from "fs";
import * as path from "path";

const bucketName: string = "aitrainer_exercises"; // Replace with your bucket name
const exercisesDir: string = "./exercises";

const storage = new Storage();
const bucket = storage.bucket(bucketName);

const uploadFile = async (
  filePath: string,
  destination: string
): Promise<void> => {
  try {
    await bucket.upload(filePath, { destination });
    console.log(`${filePath} uploaded to ${bucketName}`);
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
  }
};

const uploadDirectory = async (
  dir: string,
  prefix: string = ""
): Promise<void> => {
  const files = readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    const destPath = path.join(prefix, file.name);

    if (file.isDirectory()) {
      await uploadDirectory(fullPath, destPath);
    } else {
      await uploadFile(fullPath, destPath);
    }
  }
};

const uploadExerciseFolders = async (): Promise<void> => {
  const exerciseFolders = readdirSync(exercisesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const folder of exerciseFolders) {
    const folderPath = path.join(exercisesDir, folder);
    await uploadDirectory(folderPath, folder);
  }
};

uploadExerciseFolders()
  .then(() => console.log("All exercise folders uploaded"))
  .catch((error) =>
    console.error("Error in uploading exercise folders:", error)
  );
