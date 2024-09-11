const express = require("express");
const {
  addClasses,
  updateClasses,
  deleteClasses,
  classesDetail,
} = require("../controllers/ClassesController");
const router = express.Router();

router.get("/add-classes", addClasses);
router.get("/update-classes", updateClasses);
router.get("/delete-classes", deleteClasses);
router.get("/classes-detail", classesDetail);

module.exports = router;
