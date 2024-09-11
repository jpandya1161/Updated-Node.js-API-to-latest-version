const express = require("express");
const {
  slUserLogin,
  slUserSignup,
  getFilters,
  getExpertList,
} = require("../../controllers/users/ListingController");
const router = express.Router();

router.get("/slUserLogin", slUserLogin);
router.get("/slUserSignup", slUserSignup);
router.get("/getFilters", getFilters);
router.get("/getExpertList", getExpertList);

module.exports = router;
