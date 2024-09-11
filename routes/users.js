const express = require("express");
const router = express.Router();
const { getUsersPage } = require("../controllers/users/UsersController");

router.get("/users", getUsersPage);

module.exports = router;
