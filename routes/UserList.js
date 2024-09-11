const express = require("express");
const {
  getUser,
  getUserDetail,
  updateUserStatus,
  addUser,
  getUserActivity,
  uploadUserProfilePic,
  userTodayWorkout,
  confirmWorkout,
  getAllMembership,
  getAllMedicalQuestions,
} = require("../controllers/UserListController");
const router = express.Router();

router.get("/getUser", getUser);
router.get("/getUserDetail/:id", getUserDetail);
router.get("/getUserActivity/:id", getUserActivity);
router.get("/updateUserStatus", updateUserStatus);
router.get("/adduser", addUser);
router.get("/uploadUserProfilePic", uploadUserProfilePic);
router.get("/userTodayWorkout", userTodayWorkout);
router.get("/confirmWorkout", confirmWorkout);
router.get("/all-membership", getAllMembership);
router.get("/all-medical-questions", getAllMedicalQuestions);

module.exports = router;
