const express = require("express");
const {
  getEmployees,
  getEmployeeDetail,
  updateEmployeeStatus,
  updateEmployeesModuleStatus,
  addEmployee,
  getEmployeeInputFields,
} = require("../controllers/EmployeeListController");
const router = express.Router();

router.get("/getEmployees", getEmployees);
router.get("/getEmployeeDetail/:id", getEmployeeDetail);
router.get("/updateEmployeeStatus", updateEmployeeStatus);
router.get("/addEmployee", addEmployee);
router.get("/updateEmployeesModuleStatus", updateEmployeesModuleStatus);
router.get("/get-employee-input-fields", getEmployeeInputFields);

module.exports = router;
