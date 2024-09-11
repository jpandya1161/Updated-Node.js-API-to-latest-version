const express = require("express");
const {
  getExpertsModuleList,
  getExpertPlanList,
  checkEmail,
  getExpertNotification,
} = require("../controllers/BaseApiController");
const router = express.Router();

router.get("/getExpertsModuleList", getExpertsModuleList);
router.get("/getExpertPlanList", getExpertPlanList);
router.get("/checkEmail", checkEmail);
router.get("/getExpertNotification", getExpertNotification);

module.exports = router;
