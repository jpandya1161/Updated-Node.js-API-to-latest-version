const express = require("express");
const {
  createConversation,
  sendMessage,
  consultationChat,
  setViewedExpert,
  setViewedUser,
  sendUserMessage,
  consultationChatUser,
  getExpertUnreadMessage,
} = require("../../controllers/users/ConsultOnlineController");
const router = express.Router();

router.get("/createConversation", createConversation);
router.get("/sendMessage", sendMessage);
router.get("/consultationChat", consultationChat);
router.get("/setViewedExpert", setViewedExpert);
router.get("/setViewedUser", setViewedUser);
router.get("/sendUserMessage", sendUserMessage);
router.get("/consultationChatUser", consultationChatUser);
router.get("/getExpertUnreadMessage", getExpertUnreadMessage);

module.exports = router;
