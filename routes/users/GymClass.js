const express = require("express");
const {
  getUserGymClassList,
  getGymClassList,
  getGymClassDetail,
  bookGymClass,
  cancelGymClass,
  gymClassNotification,
} = require("../../controllers/users/GymClassController");
const router = express.Router();

router.get("/get_user_gym_class_list", getUserGymClassList);
router.get("/getGymClassList", getGymClassList);
router.get("/get_gym_class_detail", getGymClassDetail);
router.get("/bookGymClass", bookGymClass);
router.get("/cancelGymClass", cancelGymClass);
router.get("/gymClassNotification", gymClassNotification);

module.exports = router;
