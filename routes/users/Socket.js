const express = require("express");
const {
  getDailyUserCalorieData,
  getDailyUserCalorieBurnData,
  makeInactiveModule,
} = require("../../controllers/users/SocketController");
const router = express.Router();

router.get("/getDailyUserCalorieData", getDailyUserCalorieData);
router.get("/getDailyUserCalorieBurnData", getDailyUserCalorieBurnData);
router.get("/makeInactiveModule", makeInactiveModule);

module.exports = router;
