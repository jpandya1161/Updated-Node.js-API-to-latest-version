const express = require("express");
const {
  categoryIndex,
  addCategory,
  changeStatus,
  deleteCategory,
  updateCategory,
} = require("../controllers/CategoryController");
const router = express.Router();

router.get("/category-index", categoryIndex);
router.get("/add-category", addCategory);
router.get("/change-category-status", changeStatus);
router.get("/delete-category", deleteCategory);
router.get("/update-category", updateCategory);

module.exports = router;
