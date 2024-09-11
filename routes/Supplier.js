const express = require("express");
const {
  addSupplier,
  updateSupplier,
} = require("../controllers/SupplierController");
const router = express.Router();

router.get("/add-supplier", addSupplier);
router.get("/update-supplier", updateSupplier);

module.exports = router;
