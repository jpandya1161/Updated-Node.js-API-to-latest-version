const express = require("express");
const {
  cronJobs,
  sendFixedNotification,
  cronJobsEveryDay,
  set_water_notifications,
  setDailyGoalNotification,
  getTodayYogaClass,
  getTodayGymClass,
  getTodayAppointment,
  checkUserGymMembershipDate,
  updateCurrencyRates,
  timeConversion,
  insertForSingleUserFixedNotification,
  Get_geo_TimeZone_param,
  getEmployees,
} = require("../../controllers/Expert/CronJobsController");
const router = express.Router();

router.get("/cronJobs", cronJobs);
router.get("/cronJobs/sendFixedNotification", sendFixedNotification);
router.get("/cronJobsEveryDay", cronJobsEveryDay);
router.get(
  "/cronJobsEveryDay/set_water_notifications",
  set_water_notifications
);
router.get(
  "/cronJobsEveryDay/setDailyGoalNotification",
  setDailyGoalNotification
);
router.get("/cronJobsEveryDay/getTodayYogaClass", getTodayYogaClass);
router.get("/cronJobsEveryDay/getTodayGymClass", getTodayGymClass);
router.get("/cronJobsEveryDay/getTodayAppointment", getTodayAppointment);
router.get(
  "/cronJobsEveryDay/checkUserGymMembershipDate",
  checkUserGymMembershipDate
);
router.get("/cronJobsEveryDay/updateCurrencyRates", updateCurrencyRates);
router.get("/cronJobsEveryDay/timeConversion", timeConversion);
router.get(
  "/cronJobsEveryDay/insertForSingleUserFixedNotification",
  insertForSingleUserFixedNotification
);
router.get("/cronJobsEveryDay/Get_geo_TimeZone_param", Get_geo_TimeZone_param);
router.get("/getEmployees", getEmployees);

module.exports = router;
