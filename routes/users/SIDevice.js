const express = require("express");
const {
  getUserSLDeviceData,
  insertUserDeviceData,
  insertUserSleepData,
  insertUserStepData,
  getSleepHistory,
  getSleepDetailedHistory,
  getStepHistory,
  getStepDetailedHistory,
} = require("../../controllers/users/SlDeviceController");
const router = express.Router();

router.get("/getUserSLDeviceData", getUserSLDeviceData);
router.get("/insertUserDeviceData", insertUserDeviceData);
router.get("/insertUserSleepData", insertUserSleepData);
router.get("/insertUserStepData", insertUserStepData);
router.get("/getSleepHistory", getSleepHistory);
router.get("/getSleepDetailedHistory", getSleepDetailedHistory);
router.get("/getStepHistory", getStepHistory);
router.get("/getStepDetailedHistory", getStepDetailedHistory);

module.exports = router;
