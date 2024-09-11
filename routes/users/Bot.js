const express = require("express");
const {
  getMassageList,
  addUserReply,
  getQuestionCounter,
} = require("../../controllers/users/BotController");
const router = express.Router();

router.get("/get_massage_list", getMassageList);
router.get("/add_user_reply", addUserReply);
router.get("/get_question_counter", getQuestionCounter);

module.exports = router;
