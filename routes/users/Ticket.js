const express = require("express");
const {
  postTicket,
  updateReply,
  getUserTicket,
  getUserSingleTicket,
  getTicketMessage,
  replyTicket,
  expertAssignTicket,
} = require("../../controllers/users/TicketController");
const router = express.Router();

router.get("/postTicket", postTicket);
router.get("/updateReply", updateReply);
router.get("/Get_User_ticket", getUserTicket);
router.get("/getUserSingleTicket", getUserSingleTicket);
router.get("/getTicketMessage", getTicketMessage);
router.get("/replyTicket", replyTicket);
router.get("/expertAssignTicket", expertAssignTicket);

module.exports = router;
