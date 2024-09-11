const express = require("express");
const {
  getFirebaseUserDetail,
  createAuthFirebase,
  userEmployeeData,
  userAlreadyRoomCheck,
  createUserPrivateRoom,
  getFireRegisterUserData,
  getUserPrivateRoom,
  getUidImage,
  getUnreadUserRoom,
  getUsersEmployeeAdmin,
  getPrivateRoomsUsers,
  usersAdminChart,
  getFirebaseTotalUnreadAdmin,
  getTotalUnreadMessage,
  get_firebase_total_unread,
} = require("../../controllers/users/ChatController");
const router = express.Router();

router.get("/Get_firebase_user_detail", getFirebaseUserDetail);
router.get("/create_auth_firebase", createAuthFirebase);
router.get("/user_already_room_check", userAlreadyRoomCheck);
router.get("/user_employee_data", userEmployeeData);
router.get("/createUserPrivateRoom", createUserPrivateRoom);
router.get("/getFireRegisterUserData", getFireRegisterUserData);
router.get("/getUserPrivateRoom", getUserPrivateRoom);
router.get("/getUidImage", getUidImage);
router.get("/getUnreadUserRoom", getUnreadUserRoom);
router.get("/getUsersEmployeeAdmin", getUsersEmployeeAdmin);
router.get("/getPrivateRoomsUsers", getPrivateRoomsUsers);
router.get("/usersAdminChart", usersAdminChart);
router.get("/getFirebaseTotalUnreadAdmin", getFirebaseTotalUnreadAdmin);
router.get("/getTotalUnreadMessage", getTotalUnreadMessage);
router.get("/get_firebase_total_unread", get_firebase_total_unread);

module.exports = router;
