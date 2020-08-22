export enum WeightModifier {
  positive = "positive",
  negative = "negative",
}

export enum WeightUnit {
  kg = "kg",
  lbs = "lbs",
}

export enum DistanceUnit {
  km = "km",
  miles = "miles",
}

export enum Fields {
  reps = "reps",
  time = "time",
  distance = "distance",
  weight = "weight",
}

export interface Measure {
  requiredFields: Fields[];
  optionalFields?: Fields[];
  weightModifier?: WeightModifier;
  weightUnit?: WeightUnit;
  distanceUnit?: DistanceUnit;
}
