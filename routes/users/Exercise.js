const express = require("express");
const {
  getExerciseOfUser,
  exerciseStatusUpdate,
  getSearchExercise,
  getExerciseById,
  insertUserSearchExercise,
  userExerciseWeekly,
  dashboardExerciseOfUser,
  getExerciseSets,
  getExerciseSingleSets,
  getSetsSingleExercise,
  finishExercise,
  addIntervalDesc,
  addNewExercise,
} = require("../../controllers/users/ExerciseController");
const router = express.Router();

router.get("/getExerciseOfUser", getExerciseOfUser);
router.get("/exerciseStatusUpdate", exerciseStatusUpdate);
router.get("/get_Search_exercise", getSearchExercise);
router.get("/getExerciseById", getExerciseById);
router.get("/insertUserSearchExercise", insertUserSearchExercise);
router.get("/userExerciseWeekly", userExerciseWeekly);
router.get("/dashboardExerciseOfUser", dashboardExerciseOfUser);
router.get("/get_exercise_sets", getExerciseSets);
router.get("/getExerciseSingleSets", getExerciseSingleSets);
router.get("/get_sets_single_exercise", getSetsSingleExercise);
router.get("/finish_exercise", finishExercise);
router.get("/add_interval_desc", addIntervalDesc);
router.get("/add_new_exercise", addNewExercise);

module.exports = router;
