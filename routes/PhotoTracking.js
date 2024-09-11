const express = require("express");
const { trackingIndex } = require("../controllers/PhotoTrackingController");
const router = express.Router();

router.get("/trackingIndex", trackingIndex);

module.exports = router;
