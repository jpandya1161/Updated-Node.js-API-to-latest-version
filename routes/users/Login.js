const express = require("express");
const {
  login,
  getUrl,
  CheckPassword,
  updatePassword,
  updateUnit,
  Get_user_details,
  employeeLogin,
  forgot_password_link,
} = require("../../controllers/users/LoginController");
const router = express.Router();

router.get("/login", login);
router.get("/getUrl", getUrl);
router.get("/CheckPassword", CheckPassword);
router.get("/updatePassword", updatePassword);
router.get("/updateUnit", updateUnit);
router.get("/get_user_details", Get_user_details);
router.get("/employeeLogin", employeeLogin);
router.get("/forgot_password_link", forgot_password_link);

module.exports = router;
