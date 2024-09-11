const express = require("express");
const {
  blogCategoryIndex,
  addBlogCategory,
  changeBlogCatgoryStatus,
  deleteBlogCategory,
  updateBlogCategory,
} = require("../controllers/BlogCategoryController");
const router = express.Router();

router.get("/blog-category-index", blogCategoryIndex);
router.get("/add-blog-category", addBlogCategory);
router.get("/change-blog-category-status", changeBlogCatgoryStatus);
router.get("/delete-blog-category", deleteBlogCategory);
router.get("/update-blog-category", updateBlogCategory);

module.exports = router;
