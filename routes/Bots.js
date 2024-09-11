const express = require("express");
const {
  botsIndex,
  viewAnswers,
  addQuestion,
  changeQuestionStatus,
  deleteQuestion,
  updateQuestion,
} = require("../controllers/BotsController");
const router = express.Router();

router.get("/bots-index", botsIndex);
router.get("/view-answers", viewAnswers);
router.get("/add-question", addQuestion);
router.get("/change-question-status", changeQuestionStatus);
router.get("/delete-question", deleteQuestion);
router.get("/update-question", updateQuestion);

module.exports = router;
