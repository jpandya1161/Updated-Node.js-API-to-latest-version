const express = require("express");
const {
  setUserPass,
  expertNewPassword,
} = require("../../controllers/Expert/ResetPasswordController");
const router = express.Router();

router.get("/setUserPass", setUserPass);
router.get("/expertNewPassword", expertNewPassword);

module.exports = router;
