const express = require("express");
const {
  inquiryGraphData,
  membersGraphData,
  revenueGraphData,
  appUsersGraphData,
  membershipGraphData,
  revenueHistoryGraphData,
  personalTrainingGraphData,
  membersByMembershipTimeGraphData,
  membershipExpiredGraphData,
  consultantsSalesGraphData,
  memberAgeGroupGraphData,
} = require("../controllers/GraphController");
const router = express.Router();

router.get("/inquiryGraphData", inquiryGraphData);
router.get("/membersGraphData", membersGraphData);
router.get("/revenueGraphData", revenueGraphData);
router.get("/appUsersGraphData", appUsersGraphData);
router.get("/membershipGraphData", membershipGraphData);
router.get("/revenueHistoryGraphData", revenueHistoryGraphData);
router.get("/personalTrainingGraphData", personalTrainingGraphData);
router.get(
  "/membersByMembershipTimeGraphData",
  membersByMembershipTimeGraphData
);
router.get("/membershipExpiredGraphData", membershipExpiredGraphData);
router.get("/consultantsSalesGraphData", consultantsSalesGraphData);
router.get("/memberAgeGroupGraphDatas", memberAgeGroupGraphData);

module.exports = router;
