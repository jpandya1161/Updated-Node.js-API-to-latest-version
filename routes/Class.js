const express = require("express");
const {
  getClassListMonthWise,
  getClassListDayWise,
  getClassDetail,
  addClass,
  updateClass,
  deleteClass,
  rescheduleClass,
  classDetail,
  addClassCategory,
  getSingleClassInfo,
} = require("../controllers/ClassController");
const router = express.Router();

router.get("/getClassListMonthWise", getClassListMonthWise);
router.get("/getClassListDayWise", getClassListDayWise);
router.get("/getClassDetail", getClassDetail);
router.get("/add-class", addClass);
router.get("/delete-class", deleteClass);
router.get("/reschedule-class", rescheduleClass);
router.get("/classDetail", classDetail);
router.get("/add-ClassCategory", addClassCategory);
router.get("/getSingleClassInfo", getSingleClassInfo);

module.exports = router;
