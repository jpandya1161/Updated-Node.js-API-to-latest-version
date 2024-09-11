const express = require("express");
const {
  blogIndex,
  addBlog,
  changeBlogStatus,
  deleteBlog,
  updateBlog,
} = require("../controllers/BlogController");
const router = express.Router();

router.get("/blog-index", blogIndex);
router.get("/add-blog", addBlog);
router.get("/change-blog-status", changeBlogStatus);
router.get("/delete-blog", deleteBlog);
router.get("/update-blog", updateBlog);

module.exports = router;
