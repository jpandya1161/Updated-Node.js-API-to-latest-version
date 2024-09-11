const express = require("express");
const {
  addUserGoal,
  setDailyGoalNotification,
  getUserGoal,
} = require("../../controllers/users/GoalController");
const router = express.Router();

router.get("/add_user_goal", addUserGoal);
router.get("/setDailyGoalNotification", setDailyGoalNotification);
router.get("/get_user_goal", getUserGoal);

module.exports = router;
