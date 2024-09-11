const express = require("express");
const {
  sendFeedback,
  submitInquiry,
  getInquiryDetail,
} = require("../../controllers/users/InquiryController");
const router = express.Router();

router.get("/sendFeedback", sendFeedback);
router.get("/submitInquiry", submitInquiry);
router.get("/getInquiryDetail", getInquiryDetail);

module.exports = router;
