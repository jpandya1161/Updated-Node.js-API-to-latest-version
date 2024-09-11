const express = require("express");
const {
  addDeal: addDeal,
  updateDeal,
  dealSearch,
  dealDetails,
  updateStage,
  addNote,
  addTask,
  getSingleNote,
  deleteSingleNote,
  editSingleNote,
  closeDeal,
} = require("../controllers/DealsController");
const router = express.Router();

router.get("/add-deal", addDeal);
router.get("/update-deal", updateDeal);
router.get("/deal-search", dealSearch);
router.get("/deal-details", dealDetails);
router.get("/update-stage", updateStage);
router.get("/add-note", addNote);
router.get("/add-task", addTask);
router.get("/getSingleNote", getSingleNote);
router.get("/delete-singleNote", deleteSingleNote);
router.get("/edit-singleNote", editSingleNote);
router.get("/close-deal", closeDeal);

module.exports = router;
