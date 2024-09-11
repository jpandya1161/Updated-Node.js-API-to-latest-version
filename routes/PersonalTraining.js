const express = require("express");
const {
  addLevel,
  deleteLevel,
  addSetting,
  deleteSetting,
} = require("../controllers/PersonalTrainingController");
const router = express.Router();

router.get("/add-level", addLevel);
router.get("/delete-level", deleteLevel);
router.get("/add-setting", addSetting);
router.get("/delete-setting", deleteSetting);

module.exports = router;
