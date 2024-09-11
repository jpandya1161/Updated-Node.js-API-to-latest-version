const mysql = require("mysql2");
var util = require("util");
var request = require("request");
var moment = require("moment-timezone");

const mc = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: "simplyloose_superadmin",
  connectTimeout: 60000,
});

const mc1 = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: "simplyloose_sldemo",
  connectTimeout: 60000,
});

mc.connect();
mc1.connect();

mc.query = util.promisify(mc.query);
mc1.query = util.promisify(mc1.query);
request = util.promisify(request);

const express = require("express");
var app = express();
var subdomain = "";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var dateTime = require("node-datetime");
var dt = dateTime.create();

let cronJobs = async (req, res) => {
  mc.query(
    "SELECT `subdomain` FROM `expert_master` WHERE `status` = 1",
    function (error, result, fields) {
      if (!error) {
        sendFixedNotification();
        //shell_exec('http//:localhost:3000/sendFixedNotification')
        /*for(var i in result)
            {
                shell_exec('curl http//:'.result[i]['subdomain'].'.simplyloose.com/api/sendFixedNotification');
                shell_exec('curl http//:'.result[i]['subdomain'].'.simplyloose.com/cron/doBufferPost');
            }*/
      } else {
        res.send(
          JSON.stringify(
            { status: "500", error: error, response: null },
            null,
            "\t"
          )
        );
      }
    }
  );
};

let sendFixedNotification = async (req, res) => {
  var async = require("async");
  var totalSentNotification = 0;
  var totalFailNotification = 0;
  var status = 0;

  var table = "fixed_notification_master";

  var dateTime = require("node-datetime");
  var dt = dateTime.create();
  var date = dt.format("Y-m-d");
  var notification_data = null;

  var notification_data = await mc1.query(
    "SELECT * FROM " + table + " WHERE status = ? AND date = ?",
    [status, date]
  );
  //console.log(res1);
  /*var res1 = await mc1.query('SELECT * FROM ' + table + ' WHERE status = ? AND date = ?',[status,date],async function(error1,result1,feilds1) {

        //console.log(result1);
        if(result1 != null)
        {
            notification_data = result1;
            console.log(notification_data);
        }
        else {
            console.log('No Data Found');
        }

    });*/

  await console.log(notification_data);
  var random = require("random-number")({
    min: 10,
    max: 10000000,
    integer: true,
  });
  var userData = null;
  var data = null;
  var type = "push";

  /*if(notification_data != null)
    {
        for(var ind in notification_data)
        {
            if(notification_data[ind]['start_time'] != null)
            {
                if(notification_data[ind]['start_time'] <= new Date().toTimeString().split(" ")[0])
                {
                    userData[ind]['uuid'] = notification_data[ind]['uuid'];
                    userData[ind]['email'] = notification_data[ind]['email'];

                    if(notification_data[i]['device_os'] == 'Andriod')
                    {
                        data = sendFixPushNotification( ,notification_data[ind]['message'],notification_data[ind]['title'],random,type);
                        if(data == 'success')
                        {
                            mc1.query('UPDATE ' + table + ' SET status = 1 WHERE id = ?',[notification_data[ind]['id']],function(error2,result2,feilds2) {

                            });
                        }
                    }
                }
            }
        }
    }*/
};

let cronJobsEveryDay = async (req, res) => {
  global.protocol = req.protocol;
  global.url = req.get("host");

  var get_expert = await mc.query(
    "SELECT subdomain,id FROM expert_master WHERE status = 1"
  );
  for (var val in get_expert) {
    //set_water_notifications(req,res);
    // setDailyGoalNotification(req,res);

    getTodayYogaClass(req, res);
    getTodayGymClass(req, res);
    // getTodayAppointment(req,res,get_expert[val].id);
    //checkUserGymMembershipDate(req,res);
    // updateCurrencyRates(req,res);
  }
};

let set_water_notifications = async (req, res) => {
  try {
    var table1 = "register_app_master";
    var android_display = await mc1.query(
      "SELECT register_app_master.*, user_master.id as user_id,user_master.user_name as user_name,user_master.first_name as first_name,user_master.country as country,user_master.state as state,user_master.city as city,user_master.time_zone as time_zone FROM " +
        table1 +
        " left join user_master on register_app_master.email = user_master.email WHERE user_master.status = 1"
    );

    var table2 = "tbl_ios_reg_users";
    var ios_display = await mc1.query(
      "SELECT tbl_ios_reg_users.*, user_master.id as user_id,user_master.user_name as user_name,user_master.first_name as first_name,user_master.country as country,user_master.state as state,user_master.city as city,user_master.time_zone as time_zone FROM " +
        table2 +
        " left join user_master on tbl_ios_reg_users.email = user_master.email WHERE user_master.status = 1"
    );

    var table3 = "notification_template";
    var template_name = "USER_WATER_TIME";
    var data = await mc1.query(
      "SELECT message FROM " + table3 + " WHERE template_name = ?",
      [template_name]
    );
    data = data.length > 0 ? data : "It's time to drink water";

    for (var i in android_display) {
      var username =
        android_display[i]["first_name"] > 0
          ? android_display[i]["first_name"]
          : android_display[i]["user_name"];

      var message = data[0]["message"].replace("@USER_NAME", username);

      var user_id = android_display[i]["user_id"];
      var table4 = "water_intake_schedule";
      var set_water = await mc1.query(
        "SELECT * FROM " + table4 + " WHERE user_id = ?",
        [user_id]
      );

      if (set_water.length == 0)
        set_water = await mc1.query(
          "SELECT * FROM " + table4 + " WHERE user_id = ?",
          ["0"]
        );

      var country = android_display[i]["country"];
      var state = android_display[i]["state"];
      var city = android_display[i]["city"];
      var timeZone = android_display[i]["time_zone"];

      if (timeZone == null) {
        timeZone = Get_geo_TimeZone_param(country, state, city);
        var table5 = "user_master";
        var user_master_obj = await mc1.query(
          "SELECT * FROM " + table5 + " WHERE id = ?",
          [user_id]
        );
        if (user_master_obj.length > 0)
          await mc1.query(
            "UPDATE " + table5 + " SET time_zone = ? WHERE id = ?",
            [timeZone, user_id]
          );
      }
      var inserted = null;
      var count = 0;
      for (var j in set_water) {
        var time = set_water[j]["time"];
        var date_utc = dt.format("Y-m-d");

        if (timeZone) {
          moment().tz("UTC").format();
        }

        var table6 = "water_notification_master";
        inserted = await mc1.query(
          "INSERT INTO " +
            table6 +
            " (title,message,key_value,google_reg_id,device_os,uuid,email,start_time,date,status) VALUES (?,?,?,?,?,?,?,?,?,?)",
          [
            "Water Intake",
            message,
            "water_" + set_water[j]["id"],
            android_display[i]["google_reg_id"],
            "Android",
            android_display[i]["device_uuid"],
            android_display[i]["email"],
            time,
            date_utc,
            "0",
          ]
        );
      }
    }

    for (var i in ios_display) {
      var username =
        ios_display[i]["first_name"] > 0
          ? ios_display[i]["first_name"]
          : ios_display[i]["user_name"];

      var message = data[0]["message"].replace("@USER_NAME", username);

      var user_id = ios_display[i]["user_id"];
      var table4 = "water_intake_schedule";
      var set_water = await mc1.query(
        "SELECT * FROM " + table4 + " WHERE user_id = ?",
        [user_id]
      );

      if (set_water.length == 0)
        set_water = await mc1.query(
          "SELECT * FROM " + table4 + " WHERE user_id = ?",
          ["0"]
        );

      var country = ios_display[i]["country"];
      var state = ios_display[i]["state"];
      var city = ios_display[i]["city"];
      var timeZone = ios_display[i]["time_zone"];

      if (timeZone == null) {
        timeZone = Get_geo_TimeZone_param(country, state, city);
        var table5 = "user_master";
        var user_master_obj = await mc1.query(
          "SELECT * FROM " + table5 + " WHERE id = ?",
          [user_id]
        );
        if (user_master_obj.length > 0)
          await mc1.query(
            "UPDATE " + table5 + " SET time_zone = ? WHERE id = ?",
            [timeZone, user_id]
          );
      }

      for (var j in set_water) {
        var time = set_water[j]["time"];
        var date_utc = dt.format("Y-m-d");

        if (timeZone) {
          moment().tz("UTC").format();
        }

        var table6 = "water_notification_master";
        var inserted = await mc1.query(
          "INSERT INTO " +
            table6 +
            " (title,message,key_value,google_reg_id,device_os,uuid,email,start_time,date,status) VALUES (?,?,?,?,?,?,?,?,?,?)",
          [
            "Water Intake",
            message,
            "water_" + set_water[j]["id"],
            ios_display[i]["google_reg_id"],
            "iOS",
            ios_display[i]["device_uuid"],
            ios_display[i]["email"],
            time,
            date_utc,
            "0",
          ]
        );
      }
    }
    res.end();
  } catch (ex) {
    console.log(ex);
  }
};

let setDailyGoalNotification = async (req, res) => {
  var table = "user_target_master";
  var goal_data = await mc1.query("SELECT * FROM " + table);

  var notify = {};

  if (goal_data != null) {
    table = "user_daily_steps_master";
    for (var i in goal_data) {
      var user_steps = await mc1.query(
        "SELECT * FROM " + table + " WHERE date = ? AND user_id = ?",
        [dt.format("Y-m-d"), goal_data[i]["user_id"]]
      );
      var notify = {
        user_id: goal_data[i]["user_id"],
        start_time: "06:30:00",
        key_value: "step_goal",
        title: "Simplyloose Steps Goal",
        date: dt.format("Y-m-d"),
      };

      if (user_steps.length != 0) {
        notify["message"] =
          "Your target steps " +
          goal_data[i]["target_steps"] +
          " and completed steps " +
          user_steps[0]["steps"];
      } else {
        notify["message"] = "Nailed it! You met your step goal for today.";
      }
    }
    //insertForSingleUserFixedNotification(notify);
    res.end();
  } else {
    console.log("null");
  }
};

let getTodayYogaClass = (req, res) => {
  var message = [];

  mc1
    .query(
      "SELECT * FROM class_master WHERE start_date = ?",
      [dt.format("Y-m-d")],
      function (error, result, feilds) {
        employee_today_class = result;

        if (employee_today_class.length > 0) {
          for (var ind in employee_today_class) {
            start_time = timeConversion(
              employee_today_class[ind]["start_time"]
            );
            end_time = timeConversion(employee_today_class[ind]["end_time"]);

            if (employee_today_class[ind]["employee_id"] in message)
              message[employee_today_class[ind]["employee_id"]] +=
                " AND " +
                employee_today_class[ind]["title"] +
                " is from " +
                start_time +
                " to " +
                end_time;
            else
              message[employee_today_class[ind]["employee_id"]] =
                "Your today's class, " +
                employee_today_class[ind]["title"] +
                " is from " +
                start_time +
                " to " +
                end_time;
          }

          var notify = {};
          var table = "web_notification_center_employee";

          for (var ind in message) {
            notify["role_id"] = ind;
            notify["link"] =
              global.protocol + "//:" + global.url + "/admin/yoga";
            notify["message"] = message[ind];
            notify["role"] = "employee";
            notify["employee_id"] = ind;
            notify["date"] = dt.format("Y-m-d");
            notify["time"] = new Date().toTimeString().split(" ")[0];
            notify["status"] = "1";
            notify["batch_status"] = "1";

            mc1.query(
              "INSERT INTO " +
                table +
                " (employee_id,role_id,date,time,link,message,status,batch_status,role) VALUES (?,?,?,?,?,?,?,?,?)",
              [
                notify["employee_id"],
                notify["role_id"],
                notify["date"],
                notify["time"],
                notify["link"],
                notify["message"],
                notify["status"],
                notify["batch_status"],
                notify["role"],
              ],
              function (error1, result1, feilds1) {
                if (error1) console.log(error1);
              }
            );
          }
          res.end();
          /*res.json({
               'success' : 'true',
               'data'    : '',
               'message' : 'Today class notification sent'
           });*/
        } else {
          res.end();
          /*res.json({
                'success' : 'fail',
                'data'    : '',
                'message' : 'There are no today class'
            });*/
        }
      }
    )
    .catch((ex) => {
      console.log(ex);
    });
};

let getTodayGymClass = (req, res) => {
  var message = [];
  var employee_today_class = null;

  mc1.query(
    "SELECT * FROM membership_class_master WHERE start_date = ?",
    [dt.format("Y-m-d")],
    function (error, result, feilds) {
      employee_today_class = result;

      if (employee_today_class.length > 0) {
        for (var ind in employee_today_class) {
          start_time = timeConversion(employee_today_class[ind]["start_time"]);
          end_time = timeConversion(employee_today_class[ind]["end_time"]);

          var employee = employee_today_class[ind]["employee_id"].split(",");
          for (var i = 0; i < employee.length; i++) {
            if (employee[i] in message)
              message[employee[i]] +=
                " AND " +
                employee_today_class[ind]["title"] +
                " is from " +
                start_time +
                " to " +
                end_time;
            else
              message[employee[i]] =
                "Your today's class, " +
                employee_today_class[ind]["title"] +
                " is from " +
                start_time +
                " to " +
                end_time;
          }
        }

        var notify = {};
        var table = "web_notification_center_employee";

        for (var ind in message) {
          notify["role_id"] = ind;
          notify["link"] = global.protocol + "//:" + global.url + "/admin/gym";
          notify["message"] = message[ind];
          notify["role"] = "employee";
          notify["employee_id"] = ind;
          notify["date"] = dt.format("Y-m-d");
          notify["time"] = new Date().toTimeString().split(" ")[0];
          notify["status"] = "1";
          notify["batch_status"] = "1";

          mc1.query(
            "INSERT INTO " +
              table +
              " (employee_id,role_id,date,time,link,message,status,batch_status,role) VALUES (?,?,?,?,?,?,?,?,?)",
            [
              notify["employee_id"],
              notify["role_id"],
              notify["date"],
              notify["time"],
              notify["link"],
              notify["message"],
              notify["status"],
              notify["batch_status"],
              notify["role"],
            ],
            function (error1, result1, feilds1) {
              if (error1) console.log(error1);
            }
          );
        }
        res.end();
        /*res.json({
               'success' : 'true',
               'data'    : '',
               'message' : 'Today class notification sent'
           });*/
      } else {
        res.end();
        /*res.json({
                'success' : 'fail',
                'data'    : '',
                'message' : 'There are no today class'
            });*/
      }
    }
  );
};

let getTodayAppointment = async (req, res, id) => {
  var message_admin = [];
  var message_employee = [];
  var notify = [];

  var moment = require("moment");

  var employee_today_class = await mc1.query(
    "SELECT * FROM user_appointment WHERE date = ?",
    [moment().format("YYYY-MM-DD")]
  );

  if (employee_today_class.length > 0) {
    for (var i in employee_today_class) {
      var user_info = await mc1.query(
        "SELECT user_name FROM user_master WHERE id = ?",
        [employee_today_class[i]["user_id"]]
      );
      var time_info = await mc1.query("SELECT * FROM time_slot WHERE id = ?", [
        employee_today_class[i]["time_slot_id"],
      ]);

      var minutes =
        time_info[0].minutes < 10
          ? "0" + time_info[0].minutes
          : time_info[0].minutes;
      var hour =
        time_info[0].hour < 10 ? "0" + time_info[0].hour : time_info[0].hour;
      var time = hour + ":" + minutes + ":" + time_info[0].meridiem;

      if (employee_today_class[i]["expert_id"] === "Admin") {
        if (id in message_admin)
          message_admin[id] +=
            " AND with " + user_info[0].user_name + " at " + time;
        else
          message_admin[id] =
            "Your today's appointment is with " +
            user_info[0].user_name +
            " at " +
            time;
      } else {
        if (employee_today_class[i]["expert_id"] in message_employee)
          message_employee[employee_today_class[i]["expert_id"]] +=
            " AND with " + user_info[0].user_name + " at " + time;
        else
          message_employee[employee_today_class[i]["expert_id"]] =
            "Your today's appointment is with " +
            user_info[0].user_name +
            " at " +
            time;
      }
    }

    if (message_admin.length > 0) {
      var table = "web_notification_center_expert";
      notify["role_id"] = id;
      notify["link"] =
        global.protocol + "//:" + global.url + "/admin/appointment";
      notify["message"] = message_admin[id];
      notify["role"] = "expert";
      notify["date"] = moment().format("YYYY-MM-DD");
      notify["time"] = moment().format("H:m:s");
      notify["status"] = "1";
      notify["batch_status"] = "1";

      var inserted = await mc1.query(
        "INSERT INTO " +
          table +
          " (role_id, date, time, link, message, status, batch_status, role) VALUES (?,?,?,?,?,?,?,?)",
        [
          notify["role_id"],
          notify["date"],
          notify["time"],
          notify["link"],
          notify["message"],
          notify["status"],
          notify["batch_status"],
          notify["role"],
        ]
      );
    }

    if (message_employee.length > 0) {
      for (var i in message_employee) {
        var table = "web_notification_center_employee";
        notify["role_id"] = i;
        notify["link"] =
          global.protocol + "//:" + global.url + "/admin/appointment";
        notify["message"] = message_employee[i];
        notify["role"] = "employee";
        notify["employee_id"] = i;
        notify["date"] = moment().format("YYYY-MM-DD");
        notify["time"] = moment().format("H:m:s");
        notify["status"] = "1";
        notify["batch_status"] = "1";

        var inserted = await mc1.query(
          "INSERT INTO " +
            table +
            " (employee_id,role_id,date,time,link,message,status,batch_status,role) VALUES (?,?,?,?,?,?,?,?,?)",
          [
            notify["employee_id"],
            notify["role_id"],
            notify["date"],
            notify["time"],
            notify["link"],
            notify["message"],
            notify["status"],
            notify["batch_status"],
            notify["role"],
          ]
        );
      }
    }

    res.end();
  } else {
    res.end();
  }
};

let checkUserGymMembershipDate = async (req, res) => {
  var membership_obj = await mc1.query("SELECT * FROM membership_registration");
  var current_date = dt.format("Y-m-d");

  for (var i in membership_obj) {
    if (membership_obj[i]["end_date"] < current_date)
      await mc1.query(
        "UPDATE membership_registration SET status = 0 WHERE id = ?",
        [membership_obj[i]["id"]]
      );
  }
  res.end();
  /*res.json({
        status : 'success'
    });*/
};

let updateCurrencyRates = async (req, res) => {
  try {
    let config = require("../../config/services").getServices();
    var api_key = config["currency_api"];

    var json = await request(
      "http://www.apilayer.net/api/live?access_key=" + api_key + "&format=1"
    );
    var rates = JSON.parse(json["body"]);
    var file = "return {\n\tcurrency : {\n";
    for (var ind in rates["quotes"]) {
      var key = ind.replace("USD", "");
      file += "\t\t" + key + ":" + rates["quotes"][ind] + ",\n";
    }
    file += "\t}\n}";

    var fs = require("fs");
    var directory = __dirname + "/config/current_rates.js";
    fs.writeFile(directory, file, function (err) {
      if (err) console.log(err);
      else res.end();
    });
  } catch (ex) {
    console.log(ex);
  }
};

function timeConversion(time) {
  var splited = time.split(":");
  var h = splited[0] % 12;
  if (h === 0) h = 12;
  return (
    (h < 10 ? "0" : "") +
    h +
    ":" +
    splited[1] +
    (splited[0] < 12 ? " AM" : " PM")
  );
}

async function insertForSingleUserFixedNotification(info) {
  try {
    var notify = {};
    var user_table = "user_master";

    var user_data = await mc1.query(
      "SELECT user_name,email,country,state,city FROM " +
        user_table +
        " WHERE id = ?",
      [info["user_id"]]
    );

    var email = user_data[0]["email"];

    var register_table = "register_app_master";
    var notify_table = "fixed_notification_master";

    var appData = await mc1.query(
      "SELECT google_reg_id,email,device_uuid FROM " +
        register_table +
        " WHERE status = ? AND email = ?",
      ["1", email]
    );
    var country = user_data[0]["country"];
    var state = user_data[0]["state"];
    var city = user_data[0]["city"];

    /*var timeZone = await Get_geo_TimeZone_param(country,state,city);

        if(timeZone)
        {
            moment().tz(timeZone).format();
        }*/

    notify["date"] = info["date"];
    notify["start_time"] = info["start_time"];
    notify["title"] = info["title"];
    notify["message"] = info["message"];
    notify["status"] = 0;
    notify["key_value"] = info["key_value"];

    /*var loginData =
        notify['role'] =*/
    notify["user_name"] = user_data[0]["user_name"];
    notify["image"] =
      "https://logic.simplyloose.com/assets/images/expert/logo_helpdesk.png";
    notify["url"] = info["url"];

    if (appData != null) {
      for (var i in appData) {
        notify["google_reg_id"] = appData[i]["google_reg_id"];
        notify["uuid"] = appData[i]["device_uuid"];
        notify["email"] = appData[i]["email"];
        notify["device_os"] = "Android";

        var inserted = await mc1.query(
          "INSERT INTO " +
            notify_table +
            " (date,start_time,title,message,status,key_value,user_name,image,url,google_reg_id,uuid,email,device_os) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            notify["date"],
            notify["start_time"],
            notify["title"],
            notify["message"],
            notify["status"],
            notify["key_value"],
            notify["user_name"],
            notify["image"],
            notify["url"],
            notify["google_reg_id"],
            notify["uuid"],
            notify["email"],
            notify["device_os"],
          ]
        );
      }
    }

    table = "tbl_ios_reg_users";
    var iOSData = await mc1.query(
      "SELECT device_token,email,device_uuid FROM " +
        table +
        " WHERE status = ? AND email = ?",
      ["1", email]
    );

    if (iOSData != null) {
      for (var i in iOSData) {
        notify["device_token"] = iOSData[i]["device_token"];
        notify["uuid"] = iOSData[i]["device_uuid"];
        notify["email"] = iOSData[i]["email"];
        notify["device_os"] = "IOS";

        var inserted = await mc1.query(
          "INSERT INTO " +
            notify_table +
            " (date,start_time,title,message,status,key_value,user_name,image,url,google_reg_id,uuid,email,device_os) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            notify["date"],
            notify["start_time"],
            notify["title"],
            notify["message"],
            notify["status"],
            notify["key_value"],
            notify["user_name"],
            notify["image"],
            notify["url"],
            notify["google_reg_id"],
            notify["uuid"],
            notify["email"],
            notify["device_os"],
          ]
        );
      }
    }
  } catch (ex) {
    console.log(ex);
  }
}

async function Get_geo_TimeZone_param(country, state, city) {
  try {
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

    if (data["results"]) {
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
}

let getEmployees = async (req, res) => {
  mc1.query(
    "select * from employee_master left join professional_master on employee_master.profession_id = professional_master.id",
    function (error1, res1, fields1) {
      if (error1)
        res.send(
          JSON.stringify(
            { status: "500", error: error1, response: null },
            null,
            "\t"
          )
        );
      else {
        res.json({
          employeeList: res1,
        });
      }
    }
  );
};

module.exports = {
  cronJobs: cronJobs,
  sendFixedNotification: sendFixedNotification,
  cronJobsEveryDay: cronJobsEveryDay,
  set_water_notifications: set_water_notifications,
  setDailyGoalNotification: setDailyGoalNotification,
  getTodayYogaClass: getTodayYogaClass,
  getTodayGymClass: getTodayGymClass,
  getTodayAppointment: getTodayAppointment,
  checkUserGymMembershipDate: checkUserGymMembershipDate,
  updateCurrencyRates: updateCurrencyRates,
  timeConversion: timeConversion,
  insertForSingleUserFixedNotification: insertForSingleUserFixedNotification,
  Get_geo_TimeZone_param: Get_geo_TimeZone_param,
  getEmployees: getEmployees,
};
