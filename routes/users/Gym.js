const express = require("express");
const {
  getUserExerciseDatewise,
  getMembershipList,
  getMembershipDetail,
  bookMembership,
  cancelMembership,
  getUserStats,
  userWaistGraph,
  userThighGraph,
  userArmsGraph,
  userChestGraph,
  userFatGraph,
} = require("../../controllers/users/GymController");
const router = express.Router();

router.get("/get_userExercise_datewise", getUserExerciseDatewise);
router.get("/getMembershipList", getMembershipList);
router.get("/getMembershipDetail", getMembershipDetail);
router.get("/bookMembership", bookMembership);
router.get("/cancelMembership", cancelMembership);
router.get("/get_user_stats", getUserStats);
router.get("/user_waist_Graph", userWaistGraph);
router.get("/user_thigh_Graph", userThighGraph);
router.get("/user_arms_Graph", userArmsGraph);
router.get("/user_chest_Graph", userChestGraph);
router.get("/user_fat_Graph", userFatGraph);

module.exports = router;
