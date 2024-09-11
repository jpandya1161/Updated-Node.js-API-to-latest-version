const express = require("express");
const {
  addMembership,
  updateMembership,
  deleteMembership,
  changeStatus,
  editUserMembershipDate,
  detailMembership,
} = require("../controllers/MembershipController");
const router = express.Router();

router.get("/add-membership", addMembership);
router.get("/update-membership", updateMembership);
router.get("/delete-membership", deleteMembership);
router.get("/change-status", changeStatus);
router.get("/edit-membership-date", editUserMembershipDate);
router.get("/user-membership-detail", detailMembership);

module.exports = router;
