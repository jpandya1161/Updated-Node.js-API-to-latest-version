const express = require("express");
const {
  getUserAppointmentData,
  getUserEmployee,
  getEmployeeTimeSlots,
  insertTimeSlots,
  getAppointmentByDate,
  getUserEmployee_v2,
  insertTimeSlots_v2,
  getAppointmentByDate_v2,
  getTodayAppointment,
} = require("../../controllers/users/UserAppointmentController");
const router = express.Router();

router.get("/Get_User_appointment_data", getUserAppointmentData);
router.get("/getUserEmployee", getUserEmployee);
router.get("/get_employee_time_slots", getEmployeeTimeSlots);
router.get("/insert_time_slots", insertTimeSlots);
router.get("/getAppointmentByDate", getAppointmentByDate);
router.get("/Get_User_employee_v2", getUserEmployee_v2);
router.get("/insertTimeSlots_v2", insertTimeSlots_v2);
router.get("/getAppointmentByDate_v2", getAppointmentByDate_v2);
router.get("/getTodayAppointment", getTodayAppointment);

module.exports = router;
