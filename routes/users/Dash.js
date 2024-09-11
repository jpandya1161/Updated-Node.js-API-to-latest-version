const express = require("express");
const {
  getUserStatusChart,
  getUserMonthlyChart,
  getRegisterUser,
  addFavorite,
  checkFavorite,
  unFavorite,
  getFavoriteItems,
  totalItems,
  getUsersItems,
  myItems,
  getTaskCompletedDetail,
  getCalorieCompletedDetail,
  getExerciseCompletedDetail,
  getWeightCompletedDetail,
  getWaterCompletedDetail,
  getCompletedTaskDetail,
  insertUserDailyStepsCount,
  insertSleepInDepthDetails,
  getUserTimeLine,
} = require("../../controllers/users/DashController");
const router = express.Router();

router.get("/getUserStatusChart", getUserStatusChart);
router.get("/getUserMonthlyChart", getUserMonthlyChart);
router.get("/getRegisterUser", getRegisterUser);
router.get("/addFavorite", addFavorite);
router.get("/checkFavorite", checkFavorite);
router.get("/unFavorite", unFavorite);
router.get("/getFavoriteItems", getFavoriteItems);
router.get("/totalItems", totalItems);
router.get("/getUsersItems", getUsersItems);
router.get("/myItems", myItems);
router.get("/getTaskCompletedDetail", getTaskCompletedDetail);
router.get("/getCalorieCompletedDetail", getCalorieCompletedDetail);
router.get("/getExerciseCompletedDetail", getExerciseCompletedDetail);
router.get("/getWeightCompletedDetail", getWeightCompletedDetail);
router.get("/getWaterCompletedDetail", getWaterCompletedDetail);
router.get("/getCompletedTaskDetail", getCompletedTaskDetail);
router.get("/insertUserDailyStepsCount", insertUserDailyStepsCount);
router.get("/insertSleepInDepthDetails", insertSleepInDepthDetails);
router.get("/get_user_timeLine", getUserTimeLine);

module.exports = router;
