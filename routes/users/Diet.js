const express = require("express");
const {
  getSessionDiet,
  getDietFood,
  gainUpdate,
  getSearchFood,
  insertUserFood,
  getSearchFoodById,
  insertUserSearchFood,
  dietGraphDetails,
  dashboardDietdetails,
  dietProgressDetails,
  getDietSearch,
  getSessionNewDiet,
  getAddFoodDetailId,
  updateUserFood,
  foodScaleMaster,
  getAllFoodCategory,
  insertOldData,
  updateDiet,
  dietProgressFitDetails,
  getSessionDietAndroid,
  getSearchDietAndroid,
  getAllFoodCategoryAndroid,
  getFoodByUserSession,
} = require("../../controllers/users/DietController");
const router = express.Router();

router.get("/getSessionDiet", getSessionDiet);
router.get("/getDietFood", getDietFood);
router.get("/gainUpdate", gainUpdate);
router.get("/Get_Search_food", getSearchFood);
router.get("/insert_user_food", insertUserFood);
router.get("/getSearchFoodById", getSearchFoodById);
router.get("/insert_user_search_food", insertUserSearchFood);
router.get("/diet_Graph_details", dietGraphDetails);
router.get("/dashboardDietdetails", dashboardDietdetails);
router.get("/dietProgressDetails", dietProgressDetails);
router.get("/getDietSearch", getDietSearch);
router.get("/getSessionNewDiet", getSessionNewDiet);
router.get("/Get_add_food_detail_Id", getAddFoodDetailId);
router.get("/update_user_food", updateUserFood);
router.get("/food_scale_master", foodScaleMaster);
router.get("/Get_All_food_Category", getAllFoodCategory);
router.get("/Insert_old_data", insertOldData);
router.get("/updateDiet", updateDiet);
router.get("/diet_progress_fit_details", dietProgressFitDetails);
router.get("/getSessionDietAndroid", getSessionDietAndroid);
router.get("/getSearchDietAndroid", getSearchDietAndroid);
router.get("/getAllFoodCategoryAndroid", getAllFoodCategoryAndroid);
router.get("/getFoodByUserSession", getFoodByUserSession);

module.exports = router;
