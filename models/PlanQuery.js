var util = require("util");
var server = require("../server");
var moment = require("moment");
var momentTZ = require("moment-timezone");
var request = require("request");

var makeNotificationMessage = async (req, res, key, data) => {
  try {
    server.mc_superadmin.query = util.promisify(server.mc_superadmin.query);
    var message_data = await server.mc_superadmin.query(
      "SELECT * FROM notifications_message WHERE module_name_key = ?",
      [key]
    );
    if (message_data.length > 0) {
      switch (key) {
        case "diet_plan":
          {
            if (message_data[0]["message"].indexOf("@expert_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@expert_name",
                data["expert_name"]
              );

            if (message_data[0]["message"].indexOf("@session_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@session_name",
                data["session_name"]
              );

            if (message_data[0]["message"].indexOf("@user_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@user_name",
                data["user_name"]
              );

            console.log(message_data[0]["message"]);
          }
          break;

        case "exercise":
        case "user_more_details":
        case "water_intake_update":
        case "water_intake_insert":
        case "sleep_update":
          {
            if (message_data[0]["message"].indexOf("@expert_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@expert_name",
                data["expert_name"]
              );

            if (message_data[0]["message"].indexOf("@user_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@user_name",
                data["user_name"]
              );
          }
          break;

        case "user_book_appointment":
          {
            if (message_data[0]["message"].indexOf("@expert_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@expert_name",
                data["expert_name"]
              );

            if (message_data[0]["message"].indexOf("@user_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@user_name",
                data["user_name"]
              );

            if (message_data[0]["message"].indexOf("@date") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@date",
                data["date"]
              );

            if (message_data[0]["message"].indexOf("@time") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@time",
                data["time"]
              );
          }
          break;

        case "user_food_update":
        case "user_food_add":
          {
            if (message_data[0]["message"].indexOf("@user_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@user_name",
                data["user_name"]
              );

            if (message_data[0]["message"].indexOf("@food_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@food_name",
                data["food_name"]
              );

            if (message_data[0]["message"].indexOf("@session_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@session_name",
                data["session_name"]
              );
          }
          break;

        case "user_class_book":
          {
            if (message_data[0]["message"].indexOf("@class_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@class_name",
                data["class_name"]
              );

            if (message_data[0]["message"].indexOf("@user_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@user_name",
                data["user_name"]
              );

            if (message_data[0]["message"].indexOf("@date") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@date",
                data["date"]
              );

            if (message_data[0]["message"].indexOf("@time") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@time",
                data["time"]
              );
          }
          break;

        case "user_class_cancel":
          {
            if (message_data[0]["message"].indexOf("@class_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@class_name",
                data["class_name"]
              );

            if (message_data[0]["message"].indexOf("@user_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@user_name",
                data["user_name"]
              );
          }
          break;

        case "user_exercise_update":
        case "user_exercise_insert":
          {
            if (message_data[0]["message"].indexOf("@user_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@user_name",
                data["user_name"]
              );

            if (message_data[0]["message"].indexOf("@exercise_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@exercise_name",
                data["exercise_name"]
              );
          }
          break;

        case "user_buy_plan":
          {
            if (message_data[0]["message"].indexOf("@user_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@user_name",
                data["user_name"]
              );

            if (message_data[0]["message"].indexOf("@plan_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@plan_name",
                data["plan_name"]
              );
          }
          break;

        case "user_weight_update":
        case "user_water_update":
        case "user_update_step":
        case "user_update_sleep":
          {
            if (message_data[0]["message"].indexOf("@user_name") != -1)
              message_data[0]["message"] = message_data[0]["message"].replace(
                "@user_name",
                data["user_name"]
              );
          }
          break;
      }
      return message_data[0]["message"];
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

var insertForSingleUserFixedNotification = async (info) => {
  server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

  var userObj = await server.mc_subdomain.query(
    "SELECT email,country,state,city FROM user_master WHERE id = ?",
    [info["user_id"]]
  );
  var registerObj = await server.mc_subdomain.query(
    "SELECT google_reg_id,email,device_uuid FROM register_app_master WHERE email = ? AND status = ?",
    [userObj[0]["email"], 1]
  );

  /*var timeZone = await getGeoTimeZoneParam(userObj[0]['country'],userObj[0]['state'],userObj[0]['city']);
    if(timeZone)
    {
        info['start_time'] = moment(info['start_time']).tz(timeZone).format('HH:mm:ss');
        info['start_time'] = moment(info['start_time']).tz('UTC').format('HH:mm:ss');
    }*/

  var image =
    "https://logic.simplyloose.com/assets/images/expert/logo_helpdesk.png";

  if (registerObj.length > 0) {
    for (var i in registerObj) {
      var inserted = await server.mc_subdomain.query(
        "INSERT INTO fixed_notification_master (title,message,key_value,google_reg_id,device_os,uuid,email,start_time,date,user_name,role,url,image,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          info["title"],
          info["message"],
          info["key_value"],
          registerObj[i]["google_reg_id"],
          "Android",
          registerObj[i]["device_uuid"],
          registerObj[i]["email"],
          info["start_time"],
          info["date"],
          info["user_name"],
          info["role"],
          info["url"],
          image,
          1,
        ]
      );
    }
  }

  var iosObj = await server.mc_subdomain.query(
    "SELECT device_token,email,device_uuid FROM tbl_ios_reg_users WHERE email = ? AND status = ?",
    [userObj[0]["email"], 1]
  );
  if (iosObj.length > 0) {
    for (var i in iosObj) {
      var inserted = await server.mc_subdomain.query(
        "INSERT INTO fixed_notification_master (title,message,key_value,device_token,device_os,uuid,email,start_time,date,user_name,role,url,image,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          info["title"],
          info["message"],
          info["key_value"],
          iosObj[i]["device_token"],
          "iOS",
          iosObj[i]["device_uuid"],
          iosObj[i]["email"],
          info["start_time"],
          info["date"],
          info["user_name"],
          info["role"],
          info["url"],
          image,
          1,
        ]
      );
    }
  }
};

let insertForAllFixedNotification = async (info) => {
  var userObj = await server.mc_subdomain.query(
    "SELECT email,country,state,city FROM user_master"
  );
  for (let i in userObj) {
    let registerObj = await server.mc_subdomain.query(
      "SELECT google_reg_id,email,device_uuid FROM register_app_master WHERE email = ? AND status = 1",
      [userObj[i]["email"]]
    );
    for (let j in registerObj) {
      var inserted = await server.mc_subdomain.query(
        "INSERT INTO fixed_notification_master (title,message,key_value,google_reg_id,device_os,uuid,email,start_time,date,user_name,role,url,image,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          info["title"],
          info["message"],
          info["key_value"],
          registerObj[j]["google_reg_id"],
          "Android",
          registerObj[j]["device_uuid"],
          registerObj[j]["email"],
          info["start_time"],
          info["date"],
          info["user_name"],
          info["role"],
          info["url"],
          info["image"],
          info["status"],
        ]
      );
    }

    var iosObj = await server.mc_subdomain.query(
      "SELECT device_token,email,device_uuid FROM tbl_ios_reg_users WHERE email = ? AND status = ?",
      [userObj[i]["email"], 1]
    );
    for (let j in iosObj) {
      var inserted = await server.mc_subdomain.query(
        "INSERT INTO fixed_notification_master (title,message,key_value,device_token,device_os,uuid,email,start_time,date,user_name,role,url,image,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          info["title"],
          info["message"],
          info["key_value"],
          iosObj[j]["device_token"],
          "iOS",
          iosObj[j]["device_uuid"],
          iosObj[j]["email"],
          info["start_time"],
          info["date"],
          info["user_name"],
          info["role"],
          info["url"],
          info["image"],
          info["status"],
        ]
      );
    }
  }
};

var getGeoTimeZoneParam = async (country, state, city) => {
  try {
    request = util.promisify(request);

    var response = null;
    country = encodeURIComponent(country);
    state = encodeURIComponent(state);
    city = encodeURIComponent(city);

    var url =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      country +
      "," +
      state +
      "," +
      city +
      "&key=AIzaSyDRlQ66vfi_K0_saFJvm504zRH4B0mFlo8";
    var json = await request(url);

    var data = JSON.parse(json["body"]);
    console.log(data);
    if (data["results"]) {
      console.log(data["results"]);

      var lat = data.results[0].geometry.location.lat;
      var lng = data.results[0].geometry.location.lng;

      var time_url =
        "https://maps.googleapis.com/maps/api/timezone/json?location=" +
        lat +
        "," +
        lng +
        "&timestamp=1331161200&key=AIzaSyDq0OmW3R-PBFJyJWbt5Stgzh9dW7EyZGE";
      var time_json = await request(time_url);
      var timeZone = JSON.parse(time_json["body"]);

      if (timeZone["status"] === "OK") response = timeZone["timeZoneId"];
      else response = 0;
    } else {
      response = 0;
    }
    return response;
  } catch (ex) {
    console.log(ex);
  }
};

module.exports = {
  makeNotificationMessage: makeNotificationMessage,
  insertForSingleUserFixedNotification: insertForSingleUserFixedNotification,
  insertForAllFixedNotification: insertForAllFixedNotification,
  getGeoTimeZoneParam: getGeoTimeZoneParam,
};
