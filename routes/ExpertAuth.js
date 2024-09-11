const express = require("express");
const {
  ExpertLogin,
  resetPassword,
  expertAppLogin,
} = require("../controllers/ExpertAuthController");
const router = express.Router();

router.get("/ExpertLogin", ExpertLogin);
router.get("/resetPassword", resetPassword);
router.get("/expert-app-login", expertAppLogin);

module.exports = router;
