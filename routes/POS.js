const express = require("express");
const {
  posIndex,
  addPosPayment,
  saveOuterPayment,
} = require("../controllers/POSController");
const router = express.Router();

router.get("/pos-index", posIndex);
router.get("/add-pos-payment", addPosPayment);
router.get("/save-outer-pos-payment", saveOuterPayment);

module.exports = router;
