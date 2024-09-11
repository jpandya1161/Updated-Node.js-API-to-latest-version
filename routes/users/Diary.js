const express = require("express");
const {
  getTotalCalorieIntakeData,
  Get_Total_Calorie_Burn,
  Get_Daily_Fitbit_Steps,
  Get_Daily_Fitbit_Sleep,
} = require("../../controllers/users/DiaryController");
const router = express.Router();

router.get("/getTotalCalorieIntakeData", getTotalCalorieIntakeData);
router.get("/Get_Total_Calorie_Burn", Get_Total_Calorie_Burn);
router.get("/Get_Daily_Fitbit_Steps", Get_Daily_Fitbit_Steps);
router.get("/Get_Daily_Fitbit_Sleep", Get_Daily_Fitbit_Sleep);

module.exports = router;
