var util = require("util");
var server = require("../server");
var moment = require("moment");
var Serialize = require("php-serialize");
var md5 = require("md5");
var fs = require("fs");
// var exec = util.promisify(require('child_process').exec);

server.mc_superadmin.query = util.promisify(server.mc_superadmin.query);

var checkUserLoginApp = async (res, userData, outhProvider = "") => {
  server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

  //     var pwd = '';
  //     var userId = '';
  //     var response = {};
  // console.log(Object.keys(userData).length);

  if (Object.keys(userData).length > 0) {
    // if(outhProvider == 'facebook' || outhProvider == 'linkedin' || outhProvider == 'twitter')
    // {
    //     userId = userData['id'];
    // }
    // else
    // {
    //     userId = userData['email'];
    //     pwd = md5(userData['pwd']);
    // }
    // console.log(2);

    if (outhProvider != "") {
      var slUserObj = await server.mc_superadmin.query(
        "SELECT * FROM sl_user_master WHERE uid = ? AND outh_provider = ?",
        [userId, outhProvider]
      );
    } else {
      var slUserObj = await server.mc_superadmin.query(
        "SELECT * FROM sl_user_master WHERE email = ? AND password = ?",
        [userData["email"], md5(userData["pwd"])]
      );
    }

    var checkEmailObj = await checkAlreadyRegistered(
      userData["email"],
      outhProvider,
      userData["email"]
    );
    if (checkEmailObj["success"] == "true") {
      var registerObj = await server.mc_superadmin.query(
        "SELECT * FROM register_master WHERE email = ? AND register_as != ?",
        [userData["email"], "SL_User"]
      );
      if (registerObj.length == 0) {
        var registerObj = await server.mc_superadmin.query(
          "SELECT * FROM register_master WHERE uid = ? AND outh_provider = ? AND register_as = ?",
          [userId, outhProvider, "SL_User"]
        );
      }

      if (registerObj.length > 0) {
        return res.json({
          message:
            "Hey! " +
            registerObj[0]["user_name"] +
            " you are already register with simplyloose as " +
            checkEmailObj["message"] +
            ", please login using your Email " +
            registerObj[0]["email"],
          status: "fail",
        });
      }
    }

    if (slUserObj.length == 0) {
      switch (outhProvider) {
        case "facebook":
          var email =
            typeof userData["email"] != "undefined" ? userData["email"] : null;
          var gender =
            typeof userData["gender"] != "undefined"
              ? userData["gender"]
              : null;
          var link =
            typeof userData["link"] != "undefined" ? userData["link"] : null;
          var userName = userData["first_name"] + " " + userData["last_name"];

          var slUserInsert = await server.mc_superadmin.query(
            "INSERT INTO sl_user_master (outh_provider,email,first_name,last_name,uid,gender,link) VALUES (?,?,?,?,?,?,?)",
            [
              outhProvider,
              email,
              userData["first_name"],
              userData["last_name"],
              userData["id"],
              gender,
              link,
            ]
          );
          var insertId = await server.mc_superadmin.query(
            "SELECT LAST_INSERT_ID() AS id"
          );
          var registerInsert = await server.mc_superadmin.query(
            "INSERT INTO register_master (user_name,email,register_as,subdomian_name,outh_provider,uid,register_date) VALUES (?,?,?,?,?,?,?)",
            [
              userName,
              email,
              "SL_User",
              "SL_User",
              outhProvider,
              userData["id"],
              moment().format("Y-MM-DD"),
            ]
          );

          return res.json({
            message: "Login Successful",
            user_id: insertId[0]["id"],
            status: "success",
          });
          break;

        case "linkedin":
          //remaining
          break;

        case "twitter":
          var email =
            typeof userData["email"] != "undefined" ? userData["email"] : "";

          var slUserInsert = await server.mc_superadmin.query(
            "INSERT INTO sl_user_master (outh_provider,email,first_name,last_name,uid,link,user_name) VALUES (?,?,?,?,?,?,?)",
            [
              outhProvider,
              email,
              userData["name"],
              null,
              userData["id"],
              userData["profile_image_url_https"],
              userData["screen_name"],
            ]
          );
          var insertId = await server.mc_superadmin.query(
            "SELECT LAST_INSERT_ID() AS id"
          );
          var registerInsert = await server.mc_superadmin.query(
            "INSERT INTO register_master (user_name,email,register_as,subdomian_name,outh_provider,uid,register_date) VALUES (?,?,?,?,?,?,?)",
            [
              userData["name"],
              email,
              "SL_User",
              "SL_User",
              outhProvider,
              userData["id"],
              moment().format("Y-MM-DD"),
            ]
          );

          return res.json({
            message: "Login Successful",
            user_id: insertId[0]["id"],
            status: "success",
          });
          break;

        default:
          var email =
            typeof userData["email"] != "undefined" ? userData["email"] : null;
          var userName = userData["first_name"] + " " + userData["last_name"];

          var slUserInsert = await server.mc_superadmin.query(
            "INSERT INTO sl_user_master (outh_provider,email,first_name,last_name,password) VALUES (?,?,?,?,?)",
            [
              outhProvider,
              email,
              userData["first_name"],
              userData["last_name"],
              md5(userData["pwd"]),
            ]
          );
          var insertId = await server.mc_superadmin.query(
            "SELECT LAST_INSERT_ID() AS id"
          );
          var registerInsert = await server.mc_superadmin.query(
            "INSERT INTO register_master (user_name,email,register_as,subdomian_name,outh_provider,uid,register_date) VALUES (?,?,?,?,?,?,?)",
            [
              userName,
              email,
              "SL_User",
              "SL_User",
              outhProvider,
              userData["id"],
              moment().format("Y-MM-DD"),
            ]
          );

          return res.json({
            message: "Login Successful",
            user_id: insertId[0]["id"],
            status: "success",
          });
          break;
      }
    } else {
      return res.json({
        message: "Login Successful",
        user_id: slUserObj[0]["id"],
        status: "success",
      });
    }
  } else return 0;

  return 0;
};

var checkAlreadyRegistered = async (email, outhProvider = "", uid) => {
  var registerAs = "";
  var registerObj = await server.mc_superadmin.query(
    "SELECT * FROM register_master WHERE email = ? AND outh_provider = ? AND uid = ?",
    [email, outhProvider, uid]
  );
  if (registerObj.length > 0) {
    switch (registerObj[0]["register_as"]) {
      case "Expert":
        registerAs =
          "Owner of " +
          registerObj[0]["subdomian_name"].toLowerCase() +
          ".simplyloose.com";
        break;

      case "Employee":
        registerAs =
          "Employee of " +
          registerObj[0]["subdomian_name"].toLowerCase() +
          ".simplyloose.com";
        break;

      case "User":
        registerAs =
          "User of " +
          registerObj[0]["subdomian_name"].toLowerCase() +
          ".simplyloose.com";
        break;

      case "SL_User":
        registerAs = "Simplyloose User";
        break;

      default:
        registerAs = "";
        break;
    }

    return {
      success: "true",
      message: registerAs,
    };
  } else {
    return {
      success: "false",
    };
  }
};

module.exports = {
  checkUserLoginApp: checkUserLoginApp,
};
