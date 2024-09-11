const express = require("express");
const {
  getInquiryChart,
  getMembersChart,
  getRevenueChart,
  getMembershipChart,
  getAgeGroupChart,
  getMembershipByTimeChart,
  getMembershipExpiredChart,
  getAppUserChart,
  getRevenueHistoryChart,
  getPersonalTrainingChart,
  getConsultantsSalesChart,
  getPaymentEfficiencyChart,
} = require("../controllers/ChartController");
const router = express.Router();

router.get("/getInquiryChart", getInquiryChart);
router.get("/getMembersChart", getMembersChart);
router.get("/getRevenueChart", getRevenueChart);
router.get("/getMembershipChart", getMembershipChart);
router.get("/getAgeGroupChart", getAgeGroupChart);
router.get("/getMembershipByTimeChart", getMembershipByTimeChart);
router.get("/getMembershipExpiredChart", getMembershipExpiredChart);
router.get("/getAppUserChart", getAppUserChart);
router.get("/getRevenueHistoryChart", getRevenueHistoryChart);
router.get("/getPersonalTrainingChart", getPersonalTrainingChart);
router.get("/getConsultantsSalesChart", getConsultantsSalesChart);
router.get("/getPaymentEfficiencyChart", getPaymentEfficiencyChart);

module.exports = router;
