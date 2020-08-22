# Contributing

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is some guidelines on contributing to **exercises-json**. These are guidelines, not rules, so use your best judgement, and feel free to propose changes to this document in a pull request.

#### Adding/Changing An Exercise

An exercise can be modified or added by creating an PR and filling [in one of the templates](https://github.com/wrkout/exercises.json/tree/master/.github/PULL_REQUEST_TEMPLATE).

Please make sure you are familar with the [Exercise Definition](https://github.com/wrkout/exercises.json/blob/master/types/exercise.d.ts) interface for all possible fields on an exercise.

#### Exercise Naming Convention

Exercises can have many different names, especially when various pieces of equipment are involved, e.g. Barbell Bench Press, or Bench Press (Dumbbell).

Therefore we believe there should be a structure naming convention that follows the pattern:

```
<exercise.name> (<exercise.equipment>)
```

So if we continue with the Bench Press example from above:

```
Bench Press (Barbell)
Bench Press (Dumbbell)
Bench Press (Cable)
```

#### Exercise Aliases

Sometimes the varying names for the same exercise are so widly different, that it makes sense to keep both. We can do this by defining an **alias** for the exercise.

If you look at the [Exercise Definition](https://github.com/wrkout/exercises.json/blob/master/types/exercise.d.ts) file you will see the interface of an exercise supports an array of aliases.

#### Exercise Measurements

Exercises are more useful when you know how to measure them. The [Measure Definition](https://github.com/wrkout/exercises.json/blob/master/types/measure.d.ts) file contains the interface for how you would possible the results of performing an exercise.

All exercises should have an accompanying `measure.json` file.

#### Exercise Images

**NB:** Any help in creating digital copyright free images for each exercise would be extremely helpful.

Currently all exercises have two images, these have been scrapped off the internet, therefore l do not own the copy right for these images and would advise against using them in comercial projects.

#### Exercise Videos

Currently none of the exercises have videos, but if anyone can help in creating digital videos (or gifs) of each exercise, that again would be extremely helpful.
