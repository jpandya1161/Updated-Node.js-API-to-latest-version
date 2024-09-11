const express = require("express");
const {
  createEvent,
  updateEvent,
  deleteEvent,
  addEventCode,
  participantsEvent,
  addParticipant,
} = require("../controllers/EventController");
const router = express.Router();

router.get("/create-event", createEvent);
router.get("/update-event", updateEvent);
router.get("/delete-event", deleteEvent);
router.get("/add-event-code", addEventCode);
router.get("/participants-event", participantsEvent);
router.get("/add-participant", addParticipant);

module.exports = router;
