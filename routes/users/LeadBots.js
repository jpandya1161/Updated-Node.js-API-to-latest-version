const express = require("express");
const {
  getProfessionList,
} = require("../../controllers/users/LeadBotsController");
const router = express.Router();

router.get("/getProfessionList", getProfessionList);

module.exports = router;
