const express = require("express");
const {
  GetWaterOfUsers,
  getGlassOfWater,
  addNewWater,
  updateWater,
  waterIntakeGraph,
} = require("../../controllers/users/WaterController");
const router = express.Router();

router.get("/GetWaterOfUsers", GetWaterOfUsers);
router.get("/getGlassOfWater", getGlassOfWater);
router.get("/add_new_water", addNewWater);
router.get("/updateWater", updateWater);
router.get("/waterIntakeGraph", waterIntakeGraph);

module.exports = router;
