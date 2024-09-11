const express = require("express");
const {
  getUserWeightDataById,
  getUserDataById,
  insertUserWeightById,
  getUserWeightById,
  userWeightGraph,
} = require("../../controllers/users/WeightController");
const router = express.Router();

router.get("/getUserWeightDataById", getUserWeightDataById);
router.get("/Get_User_data_By_id", getUserDataById);
router.get("/Insert_User_Weight_By_id", insertUserWeightById);
router.get("/Get_User_Weight_By_Id", getUserWeightById);
router.get("/User_Weight_Graph", userWeightGraph);

module.exports = router;
