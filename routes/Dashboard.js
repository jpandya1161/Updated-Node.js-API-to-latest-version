const express = require("express");
const {
  getNavigationBar,
  dashFilter,
  getTotalGraphData,
  saveShortcut,
  upcomingData,
  getDashboardGraphs,
} = require("../controllers/DashboardController");
const router = express.Router();

router.get("/getNavigationBar", getNavigationBar);
router.get("/dash-filter", dashFilter);
router.get("/getTotalGraphData", getTotalGraphData);
router.get("/saveShortcut", saveShortcut);
router.get("/upcomingData", upcomingData);
router.get("/getDashboardGraphs", getDashboardGraphs);

module.exports = router;
