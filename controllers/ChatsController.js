const util = require("util");
const server = require("../server");
const moment = require("moment");
const Serialize = require("php-serialize");

let chatIndex = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    var userId = req.query["id"];
    var loginAs = req.query["login_as"];

    var userIds = [];
    var employeeIds = [];
    var adminData = [];

    var userObj = [];
    var employeeObj = [];

    if (loginAs == "Admin") {
      var firebaseObj = await server.mc_subdomain.query(
        'SELECT * FROM firebase_login_master WHERE login_as != "Admin"'
      );

      var userCount = 0;
      var employeeCount = 0;

      if (firebaseObj.length > 0) {
        for (var i in firebaseObj) {
          if (firebaseObj[i]["login_as"] == "User") {
            userIds[userCount] = firebaseObj[i]["user_id"];
            userCount++;
          } else {
            employeeIds[employeeCount] = firebaseObj[i]["user_id"];
            employeeCount++;
          }
        }
      }

      if (userIds.length > 0) {
        userObj = await server.mc_subdomain.query(
          "SELECT t1.*, t2.email, t2.password, t2.user_id, t2.login_as, t2.uid FROM user_master t1 LEFT JOIN firebase_login_master t2 ON t1.id = t2.user_id WHERE t2.user_id IN (?) AND t2.login_as = ? AND t1.status = ? ORDER BY user_name",
          [userIds, "User", 1]
        );
      }

      if (employeeIds.length > 0) {
        employeeObj = await server.mc_subdomain.query(
          "SELECT t1.*, t2.email, t2.password, t2.user_id, t2.login_as, t2.uid FROM employee_master t1 LEFT JOIN firebase_login_master t2 ON t1.id = t2.user_id WHERE t2.user_id IN (?) AND t2.login_as = ? AND t1.status = ? ORDER BY user_name",
          [employeeIds, "Expert", 1]
        );
      }
    } else {
      var userArray = [];
      var n = 0;
      var allUserObj = await server.mc_subdomain.query(
        "SELECT * FROM user_master WHERE status = 1"
      );
      if (allUserObj.length > 0) {
        for (var i in allUserObj) {
          if (
            allUserObj[i]["employee_id"] != null &&
            allUserObj[i]["employee_id"] != ""
          )
            employeeIds = Serialize.unserialize(allUserObj[i]["employee_id"]);
          if (employeeIds.indexOf(userId + "") != -1) {
            userArray[n] = allUserObj[i]["id"];
            n++;
          }
        }

        if (userArray.length > 0) {
          userObj = await server.mc_subdomain.query(
            "SELECT t1.*, t2.email, t2.password, t2.user_id, t2.login_as, t2.uid FROM user_master t1 LEFT JOIN firebase_login_master t2 ON t1.id = t2.user_id WHERE t2.user_id IN (?) AND t2.login_as = ? AND t1.status = ? ORDER BY user_name",
            [userArray, "User", 1]
          );
        }

        employeeObj = await server.mc_subdomain.query(
          "SELECT t1.*, t2.email, t2.password, t2.user_id, t2.login_as, t2.uid FROM employee_master t1 LEFT JOIN firebase_login_master t2 ON t1.id = t2.user_id WHERE t2.user_id != ? AND t2.login_as = ? AND t1.status = ? ORDER BY user_name",
          [userId, "Expert", 1]
        );

        var firebaseObj = await server.mc_subdomain.query(
          'SELECT * FROM firebase_login_master WHERE login_as = "Admin"'
        );
        if (firebaseObj.length > 0) {
          for (var i in firebaseObj) {
            var temp = {};
            temp["user_id"] = firebaseObj[i]["user_id"];
            temp["email"] = firebaseObj[i]["email"];
            temp["password"] = firebaseObj[i]["password"];
            temp["login_as"] = firebaseObj[i]["login_as"];
            temp["uid"] = firebaseObj[i]["uid"];

            var expertObj = await server.mc_superadmin.query(
              "SELECT t2.image_name, t2.expert_id, t2.created_at, t2.updated_at, t1.* FROM expert_master t1 LEFT JOIN expert_profile_image t2 ON t1.id = t2.expert_id WHERE t1.id = ?",
              [firebaseObj[i]["user_id"]]
            );
            temp["admin_images"] = expertObj[0];

            adminData[i] = temp;
          }
        }
      }
    }

    res.json({
      success: "true",
      user_data: userObj,
      expert_data: employeeObj,
      admin_data: adminData,
      message: "Data Found",
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: "error",
      error: e,
      message: "Something is not right!",
    });
  }
};

let getPrivateRoomOfUser = async (req, res, userId, loginAs) => {
  server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

  var userId = req.query["id"];
  var loginAs = req.query["login_as"];

  var privateRoomObj = await server.mc_subdomain.query(
    "SELECT * FROM firebase_user_private_room_master WHERE user_id = ? AND login_as = ?",
    [userId, loginAs]
  );

  var userData = [];

  if (privateRoomObj.length > 0) {
    for (var i in privateRoomObj) {
      var joinUserId = privateRoomObj[i]["join_user_id"];
      var userJoinAs = privateRoomObj[i]["join_as"];
      var userUidCreator = privateRoomObj[i]["uid_creator"];
      var userUidJoin = privateRoomObj[i]["uid_join"];
      var roomId = privateRoomObj[i]["room_id"];
      var roomName = privateRoomObj[i]["room_name"];

      var temp = {};
      temp["join_user_id"] = joinUserId;
      temp["uid_join"] = userUidJoin;
      temp["room_id"] = roomId;
      temp["room_name"] = roomName;
      temp["join_user_id"] = userUidCreator;
      temp["user_join_as"] = userJoinAs;

      if (userJoinAs == "User") {
        var responseObj = await server.mc_subdomain.query(
          "SELECT * FROM user_master WHERE id = ? AND status = 1",
          [joinUserId]
        );
        if (responseObj.length > 0) {
          temp["join_user_data"] = responseObj[0];
        }
      } else if (userJoinAs == "Expert") {
        var responseObj = await server.mc_subdomain.query(
          "SELECT * FROM employee_master WHERE id = ? AND status = 1",
          [joinUserId]
        );
        if (responseObj.length > 0) {
          temp["join_user_data"] = responseObj[0];
        }
      } else {
        var responseObj = await server.mc_superadmin.query(
          "SELECT t2.image_name, t2.expert_id, t2.created_at, t2.updated_at, t1.* FROM expert_master t1 LEFT JOIN expert_profile_image t2 ON t1.id = t2.expert_id WHERE t1.id = ?",
          [joinUserId]
        );
        if (responseObj.length > 0) {
          temp["join_user_data"] = responseObj[0];
        }
      }
      userData[i] = temp;
    }
  }

  return userData;
};

let createAuth = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    var email = req.body["email"];
    var password = req.body["pass"];
    var userName = req.body["username"];
    var uid = req.body["uid"];
    var userId = req.body["employee_id"];
    var loginAs = req.body["login_as"];

    var inserted = await server.mc_subdomain.query(
      "INSERT INTO firebase_login_master (email,password,login_as,username,uid,user_id) VALUES (?,?,?,?,?,?)",
      [email, password, loginAs, userName, uid, userId]
    );

    if (inserted["affectedRows"] > 0) {
      res.json({
        success: "true",
        mesasge: "Data Inserted",
      });
    } else {
      res.json({
        success: "fail",
        mesasge: "No Data Inserted",
      });
    }
  } catch (e) {
    console.log(e);
    res.json({
      success: "error",
      error: e,
      message: "Something is not right!",
    });
  }
};

let createRoom = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];
    let roomId = req.body["room_id"];
    let roomName = req.body["room_name"];
    let roomCreate = req.body["room_create"];

    let updated = await server.mc_subdomain.query(
      "UPDATE firebase_login_master SET room_name = ?,room_id = ?,room_create = ? WHERE id = ?",
      [roomName, roomId, roomCreate, id]
    );

    res.json({
      status: "success",
      message: "Room Created",
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: "error",
      error: e,
      message: "Something is not right!",
    });
  }
};

let alreadyRoomCheck = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let creatorUserId = req.body["creator_user_id"];
    let joinUserId = req.body["join_user_id"];

    let roomObj = await server.mc_subdomain.query(
      "SELECT * FROM firebase_user_private_room_master WHERE uid_creator = ? AND uid_join = ?",
      [creatorUserId, joinUserId]
    );
    if (roomObj.length > 0) {
      res.json({
        status: "success",
        data: roomObj[0],
        message: "Data Found",
      });
    } else {
      res.json({
        status: "fail",
        message: "No Data Found",
      });
    }
  } catch (e) {
    console.log(e);
    res.json({
      success: "error",
      error: e,
      message: "Something is not right!",
    });
  }
};

let createPrivateRoom = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    var userId = req.body["user_id"];
    var joinUserId = req.body["join_user_id"];
    var userName = req.body["user_name"];
    var joinUserName = req.body["join_username"];
    var uidCreator = req.body["uid_creator"];
    var uidJoin = req.body["uid_join"];
    var roomName = req.body["room_name"];
    var roomId = req.body["room_id"];
    var loginAs = req.body["login_as"];
    var joinAs = req.body["join_as"];

    var inserted1 = await server.mc_subdomain.query(
      "INSERT INTO firebase_user_private_room_master (user_id,join_user_id,username,join_username,uid_creator,uid_join,room_name,room_id,login_as,join_as) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
        userId,
        joinUserId,
        userName,
        joinUserName,
        uidCreator,
        uidJoin,
        roomName,
        roomId,
        loginAs,
        joinAs,
      ]
    );

    var inserted2 = await server.mc_subdomain.query(
      "INSERT INTO firebase_user_private_room_master (user_id,join_user_id,username,join_username,uid_creator,uid_join,room_name,room_id,login_as,join_as) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
        joinUserId,
        userId,
        joinUserName,
        userName,
        uidJoin,
        uidCreator,
        roomName,
        roomId,
        loginAs,
        joinAs,
      ]
    );

    res.json({
      success: "true",
      message: "Private Room Created",
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: "error",
      error: e,
      message: "Something is not right!",
    });
  }
};

module.exports = {
  chatIndex: chatIndex,
  getPrivateRoomOfUser: getPrivateRoomOfUser,
  createAuth: createAuth,
  createRoom: createRoom,
  alreadyRoomCheck: alreadyRoomCheck,
  createPrivateRoom: createPrivateRoom,
};
