const express = require("express");
const {
  getExpertModuleList,
  getRecentUsers,
  getExpertStoreDetail,
  getExpertBasicDetail,
  updateExpertBasicDetail,
  getExpertServiceList,
  updateExpertService,
  getExpertInfo,
  updateExpertCurrency,
  getUserMenu,
  getAssessmentForms,
  filledForm,
  viewFormSubmit,
  addFormSubmit,
  getSubmitedForm,
  updateFormSubmit,
  deleteSubmitedForm,
  changeExpertPassword,
  getChatList,
  updateToken,
} = require("../controllers/ExpertDetailController");
const router = express.Router();

router.get("/getExpertModuleList", getExpertModuleList);
router.get("/getRecentUsers", getRecentUsers);
router.get("/getExpertStoreDetail", getExpertStoreDetail);
router.get("/getExpertBasicDetail", getExpertBasicDetail);
router.get("/updateExpertBasicDetail", updateExpertBasicDetail);
router.get("/getExpertServiceList", getExpertServiceList);
router.get("/updateExpertService", updateExpertService);
router.get("/getExpertInfo", getExpertInfo);
router.get("/updateExpertCurrency", updateExpertCurrency);
router.get("/getUserMenu", getUserMenu);
router.get("/getAssessmentForms", getAssessmentForms);
router.get("/filledForm", filledForm);
router.get("/viewFormSubmit", viewFormSubmit);
router.get("/addFormSubmit", addFormSubmit);
router.get("/getSubmitedForm", getSubmitedForm);
router.get("/updateFormSubmit", updateFormSubmit);
router.get("/deleteSubmitedForm", deleteSubmitedForm);
router.get("/changeExpertPassword", changeExpertPassword);
router.get("/getChatList", getChatList);
router.get("/updateToken", updateToken);

module.exports = router;
