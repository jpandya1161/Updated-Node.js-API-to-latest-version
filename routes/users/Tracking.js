const express = require("express");
const {
  getScale,
  uploadImage,
  addNewRecipe,
  getRecipeOfUser,
  getSingleRecipeOfUser,
  deleteRecipe,
  updateRecipe,
} = require("../../controllers/users/TrackingController");
const router = express.Router();

router.get("/getScale", getScale);
router.get("/Upload_image", uploadImage);
router.get("/add_new_recipe", addNewRecipe);
router.get("/get_recipe_of_user", getRecipeOfUser);
router.get("/get_single_recipe_of_user", getSingleRecipeOfUser);
router.get("/delete_recipe", deleteRecipe);
router.get("/update_recipe", updateRecipe);

module.exports = router;
