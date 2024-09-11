const express = require("express");
const {
  getUserAllergiesById,
  getUserMedicationsById,
  getUserConditionsById,
  updateAllergies,
  updateMedications,
  updateMedicalCondition,
  updateBasicDetails,
  getExpertByUser,
  updateExpertAssign,
  getExpertByRecipe,
  updateExpertAssignRecipe,
  addBloodPresureData,
  checkBloodData,
  checkBloodGlucose,
  addBloodGlucoseData,
  addLabTestReports,
  uploadProfileImage,
  getExpertsOfUsers,
  getAllAllergies,
  insertNewAllergies,
  deleteAllergies,
  editAllergies,
  getAllMedicalConditions,
  insertNewMedicalConditions,
  deleteMedicalConditions,
  editMedicalCondition,
  getAllMedications,
  insertNewMedications,
  deleteMedications,
  editMedications,
  getAllAllergiesAndroid,
  getAllMedicalConditionsAndroid,
  getAllMedicationsAndroid,
  bookService,
} = require("../../controllers/users/BasicController");
const router = express.Router();

router.get("/Get_User_allergies_By_id", getUserAllergiesById);
router.get("/Get_User_medications_By_id", getUserMedicationsById);
router.get("/Get_User_conditions_By_id", getUserConditionsById);
router.get("/updateAllergies", updateAllergies);
router.get("/updateMedications", updateMedications);
router.get("/updateMedicalCondition", updateMedicalCondition);
router.get("/updateBasicDetails", updateBasicDetails);
router.get("/getExpertByUser", getExpertByUser);
router.get("/updateExpertAssign", updateExpertAssign);
router.get("/getExpertByRecipe", getExpertByRecipe);
router.get("/updateExpertAssignRecipe", updateExpertAssignRecipe);
router.get("/addBloodPresureData", addBloodPresureData);
router.get("/checkBloodData", checkBloodData);
router.get("/checkBloodGlucose", checkBloodGlucose);
router.get("/addBloodGlucoseData", addBloodGlucoseData);
router.get("/addLabTestReports", addLabTestReports);
router.get("/uploadProfileImage", uploadProfileImage);
router.get("/Get_experts_of_users", getExpertsOfUsers);
router.get("/getAllAllergies", getAllAllergies);
router.get("/insert_new_allergies", insertNewAllergies);
router.get("/delete_allergies", deleteAllergies);
router.get("/edit_allergies", editAllergies);
router.get("/getAllMedicalConditions", getAllMedicalConditions);
router.get("/insert_new_medical_conditions", insertNewMedicalConditions);
router.get("/delete_medical_conditions", deleteMedicalConditions);
router.get("/edit_medical_condition", editMedicalCondition);
router.get("/getAllMedications", getAllMedications);
router.get("/insert_new_medications", insertNewMedications);
router.get("/delete_medications", deleteMedications);
router.get("/edit_medications", editMedications);
router.get("/getAllAllergiesAndroid", getAllAllergiesAndroid);
router.get("/getAllMedicalConditionsAndroid", getAllMedicalConditionsAndroid);
router.get("/getAllMedicationsAndroid", getAllMedicationsAndroid);
router.get("/bookService", bookService);

module.exports = router;
