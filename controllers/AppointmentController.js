var server = require("../server");
var util = require("util");
var moment = require("moment");

var dateTime = require("node-datetime");
var dt = dateTime.create();

let getAppointmentDayListMonthWise = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var date = req.query["date"];

      var startDate = moment(date, "Y-MM-DD")
        .startOf("month")
        .format("Y-MM-DD");
      var endDate = moment(date, "Y-MM-DD").endOf("month").format("Y-MM-DD");

      var table = "user_appointment";
      var data = await server.mc_subdomain.query(
        'SELECT DATE_FORMAT(date,"%Y-%m-%d") AS date FROM ' +
          table +
          " WHERE expert_id = ? AND date >= ? AND date <= ? AND status = ?",
        ["Admin", startDate, endDate, "1"]
      );

      var i = 0;
      var currentMonthAppointmentDateList = [];
      for (var ind in data) {
        if (currentMonthAppointmentDateList.indexOf(data[ind]["date"]) == -1) {
          currentMonthAppointmentDateList[i] = data[ind]["date"];
          i++;
        }
      }

      var appointmentObj = await server.mc_subdomain.query(
        'SELECT *,DATE_FORMAT(date,"%Y-%m-%d") AS date FROM user_appointment WHERE expert_id = "Admin" AND date = ? AND status = 1',
        [date]
      );
      for (let i in appointmentObj) {
        var userObj = await server.mc_subdomain.query(
          "SELECT id,user_name,first_name,last_name,email,phone,gender,profile_image FROM user_master WHERE id = ?",
          [appointmentObj[i]["user_id"]]
        );
        appointmentObj[i]["user_master"] = userObj[0];

        var timeSlotObj = await server.mc_subdomain.query(
          "SELECT * FROM time_slot WHERE id = ?",
          [appointmentObj[i]["time_slot_id"]]
        );
        appointmentObj[i]["time_slot"] = timeSlotObj[0];
      }

      if (appointmentObj.length > 0) {
        res.json({
          dateList: currentMonthAppointmentDateList,
          appointmentList: appointmentObj,
          massage: "Data Found",
          status: "success",
        });
      } else {
        res.json({
          dateList: currentMonthAppointmentDateList,
          appointmentList: [],
          massage: "No Data Found",
          status: "success",
        });
      }
    } catch (ex) {
      console.log(ex);
      res.json({
        error: ex,
        massage: "Error Occured",
        status: "fail",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

let getAppointmentListDayWise = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var currentDate = moment(req.query["date"], "ddd MMM DD Y").format(
        "Y-MM-DD"
      );
      var limit = req.query["limit"] || 3;

      var appointmentObj = await server.mc_subdomain.query(
        'SELECT *,DATE_FORMAT(date,"%Y-%m-%d") AS date FROM user_appointment WHERE expert_id = "Admin" AND date = ? AND status = 1',
        [currentDate]
      );
      for (let i in appointmentObj) {
        var userObj = await server.mc_subdomain.query(
          "SELECT id,user_name,first_name,last_name,email,phone,gender,profile_image FROM user_master WHERE id = ?",
          [appointmentObj[i]["user_id"]]
        );
        appointmentObj[i]["user_master"] = userObj[0];

        var timeSlotObj = await server.mc_subdomain.query(
          "SELECT * FROM time_slot WHERE id = ?",
          [appointmentObj[i]["time_slot_id"]]
        );
        appointmentObj[i]["time_slot"] = timeSlotObj[0];
      }

      if (appointmentObj.length > 0) {
        res.json({
          appointmentList: appointmentObj,
          massage: "Data Found",
          status: "success",
        });
      } else {
        res.json({
          appointmentList: [],
          massage: "No Data Found",
          status: "success",
        });
      }
    } catch (ex) {
      console.log(ex);
      res.json({
        error: ex,
        massage: "Error Occured",
        status: "fail",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

let deleteAppointment = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var id = req.body.id;

      var data = await server.mc_subdomain.query(
        "DELETE FROM user_appointment WHERE id = ?",
        [id]
      );

      if (data["affectedRows"] > 0) {
        res.json({
          msg: "deleted",
          status: "success",
        });
      } else {
        res.json({
          msg: "User not found",
          status: "success",
        });
      }
    } catch (ex) {
      res.json({
        error: ex,
        msg: "Something is not right",
        status: "fail",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

module.exports = {
  getAppointmentDayListMonthWise: getAppointmentDayListMonthWise,
  getAppointmentListDayWise: getAppointmentListDayWise,
  deleteAppointment: deleteAppointment,
};
