const express = require("express");
const {
  addInventory,
  updateInventory,
  deleteInventory,
  addProductType,
  addBrand,
  addCategory,
} = require("../controllers/InventoryController");
const router = express.Router();

router.get("/add-inventory", addInventory);
router.get("/update-inventory", updateInventory);
router.get("/delete-inventory", deleteInventory);
router.get("/add-product-type", addProductType);
router.get("/add-brand", addBrand);
router.get("/add-category", addCategory);

module.exports = router;
