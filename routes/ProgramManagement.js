const express = require("express");
const {
  getDietPlans,
  getDietPlanDayWise,
  getExecisePlans,
  getExercisePlanDayWise,
  getProgramPlans,
  getFoodList,
  getFoodDetail,
  updateDietItem,
  updateExerciseItem,
  copyDietPlanDayWise,
  copyExercisePlanDayWise,
  addProgramPlan,
  updateProgramPlan,
  addDietPlan,
  addExercisePlan,
  deleteDietPlan,
  deleteExercisePlan,
  getFoodScale,
  getFoodCategory,
  createFood,
  addFood,
  updateDietPlan,
  updateExercisePlan,
} = require("../controllers/ProgramManagementController");
const router = express.Router();

router.get("/getDietPlans", getDietPlans);
router.get("/getExercisePlans", getExecisePlans);
router.get("/getDietPlanDayWise", getDietPlanDayWise);
router.get("/getExercisePlanDayWise", getExercisePlanDayWise);
router.get("/getProgramPlans", getProgramPlans);
router.get("/getFoodList", getFoodList);
router.get("/getFoodDetail", getFoodDetail);
router.get("/updateDietItem", updateDietItem);
router.get("/updateExerciseItem", updateExerciseItem);
router.get("/copyDietPlanDayWise", copyDietPlanDayWise);
router.get("/copyExercisePlanDayWise", copyExercisePlanDayWise);
router.get("/addProgramPlan", addProgramPlan);
router.get("/updateProgramPlan", updateProgramPlan);
router.get("/addDietPlan", addDietPlan);
router.get("/addExercisePlan", addExercisePlan);
router.get("/deleteDietPlan", deleteDietPlan);
router.get("/deleteExercisePlan", deleteExercisePlan);
router.get("/getFoodScale", getFoodScale);
router.get("/getFoodCategory", getFoodCategory);
router.get("/createFood", createFood);
router.get("/addFood", addFood);
router.get("/updateDietPlan", updateDietPlan);
router.get("/updateExercisePlan", updateExercisePlan);

module.exports = router;
