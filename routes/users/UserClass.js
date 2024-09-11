const express = require("express");
const {
  getUserClassList,
  getClassList,
  getClassDetail,
  bookClass,
  cancelClass,
  yogaClassNotification,
  getTodayYogaClasses,
  getTodayGymClasses,
} = require("../../controllers/users/UserClassController");
const router = express.Router();

router.get("/getUserClassList", getUserClassList);
router.get("/getClassList", getClassList);
router.get("/get_class_detail", getClassDetail);
router.get("/bookClass", bookClass);
router.get("/cancelClass", cancelClass);
router.get("/yogaClassNotification", yogaClassNotification);
router.get("/getTodayYogaClasses", getTodayYogaClasses);
router.get("/getTodayGymClasses", getTodayGymClasses);

module.exports = router;
