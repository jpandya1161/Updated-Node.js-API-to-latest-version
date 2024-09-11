const express = require("express");
const {
  insertFitBitData,
  disconnectFitBit,
  checkFitBit,
} = require("../../controllers/users/DeviceController");
const router = express.Router();

router.get("/insertFitBitData", insertFitBitData);
router.get("/disconnectFitBit", disconnectFitBit);
router.get("/checkFitBit", checkFitBit);

module.exports = router;
