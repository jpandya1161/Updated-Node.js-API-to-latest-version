const express = require("express");
const {
  addRegisterId,
  registerIOSUser,
  sendFixedNotification,
  sendWebToast,
  getWebNotificationDataForExpert,
  getWebNotificationOldDataForExpert,
  getTotalBadge,
  getWebNotificationDataForEmployee,
  getTotalBadgeEmployee,
  getWebNotificationOldDataForEmployee,
  RefreshNotificationDataForUser,
  RefreshNotificationOldDataForUser,
  FixNotificationDataForUser,
  FixNotificationDataForUserNative,
  getWebNotificationDataForSuperAdmin,
  getWebNotificationOldDataForSuper,
  getTotalBadgeSuper,
  sendPushNotification,
  updateNotificationStatus,
  get_notification_header,
  isUserConfig,
  isIOSUserConfig,
  set_water_notifications,
  sendWaterNotification,
} = require("../../controllers/users/PushController");
const router = express.Router();

router.get("/RegisterApp", addRegisterId);
router.get("/registerIOSUser", registerIOSUser);
router.get("/sendFixedNotification", sendFixedNotification);
router.get("/sendWebToast", sendWebToast);
router.get("/getWebNotificationDataForExpert", getWebNotificationDataForExpert);
router.get(
  "/getWebNotificationOldDataForExpert",
  getWebNotificationOldDataForExpert
);
router.get("/getTotalBadge", getTotalBadge);
router.get(
  "/getWebNotificationDataForEmployee",
  getWebNotificationDataForEmployee
);
router.get("/getTotalBadgeEmployee", getTotalBadgeEmployee);
router.get(
  "/getWebNotificationOldDataForEmployee",
  getWebNotificationOldDataForEmployee
);
router.get("/RefreshNotificationDataForUser", RefreshNotificationDataForUser);
router.get(
  "/RefreshNotificationOldDataForUser",
  RefreshNotificationOldDataForUser
);
router.get("/FixNotificationDataForUser", FixNotificationDataForUser);
router.get(
  "/FixNotificationDataForUserNative",
  FixNotificationDataForUserNative
);
router.get(
  "/getWebNotificationDataForSuperAdmin",
  getWebNotificationDataForSuperAdmin
);
router.get(
  "/getWebNotificationOldDataForSuper",
  getWebNotificationOldDataForSuper
);
router.get("/getTotalBadgeSuper", getTotalBadgeSuper);
router.get("/sendPushNotification", sendPushNotification);
router.get("/updateNotificationStatus", updateNotificationStatus);
router.get("/get_notification_header", get_notification_header);
router.get("/isUserConfig", isUserConfig);
router.get("/isIOSUserConfig", isIOSUserConfig);
router.get("/set_water_notifications", set_water_notifications);
router.get("/sendWaterNotification", sendWaterNotification);

module.exports = router;
