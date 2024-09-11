const express = require("express");
const {
  getPlan,
  getPlanOfUser,
  getAllPlanOfUser,
  setNewPlanOfUser,
  getAllPlanAndModules,
  paymentGetCredentials,
  buyPlanOfUser,
  updatePlanOfUser,
  get_user_membership_detail,
} = require("../../controllers/users/PlanController");
const router = express.Router();

router.get("/getPlan", getPlan);
router.get("/get_plan_of_user", getPlanOfUser);
router.get("/getAllPlanOfUser", getAllPlanOfUser);
router.get("/setNewPlanOfUser", setNewPlanOfUser);
router.get("/getAllPlanAndModules", getAllPlanAndModules);
router.get("/paymentGetCredentials", paymentGetCredentials);
router.get("/buyPlanOfUser", buyPlanOfUser);
router.get("/updatePlanOfUser", updatePlanOfUser);
router.get("/get_user_membership_detail", get_user_membership_detail);

module.exports = router;
