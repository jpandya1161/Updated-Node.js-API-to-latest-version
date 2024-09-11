const express = require("express");
const {
  getArticle,
  getSingleArticle,
} = require("../../controllers/users/ArticleController");
const router = express.Router();

router.get("/getArticle", getArticle);
router.get("/getSingleArticle", getSingleArticle);

module.exports = router;
