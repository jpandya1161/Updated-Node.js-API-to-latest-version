const express = require("express");
const {
  chatIndex,
  getPrivateRoomOfUser,
  createAuth,
  createRoom,
  alreadyRoomCheck,
  createPrivateRoom,
} = require("../controllers/ChatsController");
const router = express.Router();

router.get("/chat-index", chatIndex);
router.get("/getPrivateRoomOfUser", getPrivateRoomOfUser);
router.get("/create-auth", createAuth);
router.get("/create-room", createRoom);
router.get("/already-room-check", alreadyRoomCheck);
router.get("/create-private-room", createPrivateRoom);

module.exports = router;
