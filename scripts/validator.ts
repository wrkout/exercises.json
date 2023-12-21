import * as Yup from "yup";
import exercises from "../exercises.json";
import version from "../version-control.json";

const URL_VALIDATOR = /^https?:\/\/[a-zA-Z0-9/:.()_-]+\.(jpg|jpeg|png)$/;
const VALID_STRING = /^[a-zA-Z0-9\s'.,/ ():\-;]+$/;

function basicStrValidation(fieldName: string) {
  return Yup.string().matches(VALID_STRING, `${fieldName} failed regexp`);
}

const exerciseSchema = Yup.array().of(
  Yup.object({
    name: basicStrValidation("name").required(),
    force: basicStrValidation("force").nullable(),
    level: Yup.string().oneOf(["beginner", "intermediate", "expert"]),
    mechanic: basicStrValidation("mechanic").nullable(),
    equipment: basicStrValidation("equipment").nullable(),
    primaryMuscles: Yup.array()
      .of(basicStrValidation("primaryMuscles"))
      .required(),
    secondaryMuscles: Yup.array().of(basicStrValidation("secondaryMuscles")),
    instructions: Yup.array().of(basicStrValidation("instructions")).required(),
    category: basicStrValidation("category").required(),
    id: basicStrValidation("id").required(),
    imagePaths: Yup.array().of(Yup.string().matches(URL_VALIDATOR)).required(),
  })
);

function ValidateExercises() {
  exerciseSchema
    .validate(exercises.exercises)
    .then((validData) => {
      // Handle the validated data
      console.log(validData);
    })
    .catch((err) => {
      console.log(err);
      if (err && err.inner) {
        err.inner.forEach((e: any) => {
          console.error(`Validation error at ${e.path}: ${e.message}`);
          // For debugging: log the invalid value
          console.log(`Invalid value:`, e.path);
        });
      }
    });
}
ValidateExercises();
