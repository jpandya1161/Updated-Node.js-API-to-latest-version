const express = require("express");
const {
  getVideo,
  getSingleVideo,
} = require("../../controllers/users/VideosController");
const router = express.Router();

router.get("/Get_video", getVideo);
router.get("/get_single_video", getSingleVideo);

module.exports = router;
