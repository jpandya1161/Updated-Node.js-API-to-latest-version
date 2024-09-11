const express = require("express");
const {
  UserApiKeyController,
} = require("../../controllers/users/UserApiKeyController");
const router = express.Router();

router.get("/user_APiKey/:id", function (req, res) {
  const userId = req.params.id;
  const now = moment().format("YYYY-MM-DD HH:mm:ss");
  res.send(`User ${userId} requested at ${now}`);
});


module.exports = router;
