const express = require("express");
const {
  addPurchase,
  updatePurchase,
} = require("../controllers/PurchaseController");
const router = express.Router();

router.get("/add-purchase", addPurchase);
router.get("/update-purchase", updatePurchase);

module.exports = router;
