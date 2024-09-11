const express = require("express");
const {
  getAppointmentDayListMonthWise,
  getAppointmentListDayWise,
  deleteAppointment,
} = require("../controllers/AppointmentController");
const router = express.Router();

router.get("/getAppointmentDayListMonthWise", getAppointmentDayListMonthWise);
router.get("/getAppointmentListDayWise", getAppointmentListDayWise);
router.get("/deleteAppointment", deleteAppointment);

module.exports = router;
