const express = require("express");
const {
  Get_User_Steps_data_By_id,
  Insert_User_steps_By_id,
  Insert_User_steps_By_id_v2,
  Get_User_Sleep_data_By_id,
  Insert_User_sleep_By_id,
  bodyAssessmentList,
  bodyAssessmentDetails,
  Get_Sleep_indep_detail_Fitbit,
  Get_Step_indep_detail_Fitbit,
} = require("../../controllers/users/ReportController");
const router = express.Router();

router.get("/Get_User_Steps_data_By_id", Get_User_Steps_data_By_id);
router.get("/Insert_User_steps_By_id", Insert_User_steps_By_id);
router.get("/Insert_User_steps_By_id_v2", Insert_User_steps_By_id_v2);
router.get("/Get_User_Sleep_data_By_id", Get_User_Sleep_data_By_id);
router.get("/Insert_User_sleep_By_id", Insert_User_sleep_By_id);
router.get("/bodyAssessmentList", bodyAssessmentList);
router.get("/bodyAssessmentDetails", bodyAssessmentDetails);
router.get("/Get_Sleep_indep_detail_Fitbit", Get_Sleep_indep_detail_Fitbit);
router.get("/Get_Step_indep_detail_Fitbit", Get_Step_indep_detail_Fitbit);

module.exports = router;
