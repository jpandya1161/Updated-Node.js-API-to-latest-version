const server = require("../server");
const util = require("util");

const moment = require("moment");
const Serialize = require("php-serialize");

let createEvent = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let loginAs = req.body["login_as"];
    let eventName = req.body["event_name"];
    let startDate = req.body["start_date"];
    let endDate = req.body["end_date"];
    let startTime = req.body["start_time"];
    let endTime = req.body["end_time"];
    let eventCode = req.body["event_code"];
    let trainer = req.body["trainer"];
    let package = req.body["package"];
    let desc = req.body["description"];
    let instruction = req.body["instruction"];
    let toggleWeb = req.body["toogle_web"] || 0;
    let toggleApp = req.body["toogle_app"] || 0;
    let toggleMember = req.body["toogle_member"] || 0;

    let inserted = await server.mc_subdomain.query(
      "INSERT INTO event_master (creator_id,event_name,start_date,end_date,start_time,end_time,event_code,trainers,packages,description,instruction,web,app,eligible_member) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        loginAs,
        eventName,
        startDate,
        endDate,
        startTime,
        endTime,
        eventCode,
        Serialize.serialize(trainer),
        Serialize.serialize(package),
        desc,
        instruction,
        toggleWeb,
        toggleApp,
        toggleMember,
      ]
    );

    res.json({
      status: "success",
      message: "Event Created",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let updateEvent = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];
    let loginAs = req.body["login_as"];
    let eventName = req.body["event_name"];
    let startDate = req.body["start_date"];
    let endDate = req.body["end_date"];
    let startTime = req.body["start_time"];
    let endTime = req.body["end_time"];
    let eventCode = req.body["event_code"];
    let trainer = req.body["trainer"];
    let package = req.body["package"];
    let desc = req.body["description"];
    let instruction = req.body["instruction"];
    let toggleWeb = req.body["toogle_web"] || 0;
    let toggleApp = req.body["toogle_app"] || 0;
    let toggleMember = req.body["toogle_member"] || 0;

    let inserted = await server.mc_subdomain.query(
      "UPDATE event_master SET creator_id = ?,event_name = ?,start_date = ?,end_date = ?,start_time = ?,end_time = ?,event_code = ?,trainers = ?,packages = ?,description = ?,instruction = ?,web = ?,app = ?,eligible_member = ? WHERE id = ?",
      [
        loginAs,
        eventName,
        startDate,
        endDate,
        startTime,
        endTime,
        eventCode,
        Serialize.serialize(trainer),
        Serialize.serialize(package),
        desc,
        instruction,
        toggleWeb,
        toggleApp,
        toggleMember,
        id,
      ]
    );

    res.json({
      status: "success",
      message: "Event Updated",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let deleteEvent = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let deleted = await server.mc_subdomain.query(
      "DELETE FROM event_master WHERE id = ?",
      [req.body["id"]]
    );

    res.json({
      status: "success",
      message: "Event Deleted",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let addEventCode = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let inserted = await server.mc_subdomain.query(
      "INSERT INTO event_master (name,status) VALUES (?,?)",
      [req.body["code_name"], 1]
    );

    res.json({
      status: "success",
      message: "Event Code Created",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let participantsEvent = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let eventObj = await server.mc_subdomain.query(
      "SELECT * FROM event_attendance WHERE event_id = ?",
      [req.body["id"]]
    );
    if (eventObj.length > 0) {
      res.json({
        status: "success",
        data: eventObj,
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
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let addParticipant = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];
    let userIds = req.body["user_ids"];

    let users = [];
    let eventObj = await server.mc_subdomain.query(
      "SELECT * FROM event_attendance WHERE event_id = ?",
      [id]
    );
    for (let i in eventObj) {
      if (userIds.length < i) {
        let deleted = await server.mc_subdomain.query(
          "DELETE FROM event_attendance WHERE event_id = ? AND user_id = ?",
          [id, eventObj[i]["user_id"]]
        );
      } else {
        let updated = await server.mc_subdomain.query(
          "UPDATE event_attendance SET user_id = ? WHERE event_id = ? AND user_id = ?",
          [userIds[i], id, eventObj[i]["user_id"]]
        );
        userIds[i] = null;
      }
    }

    for (let i in userIds) {
      if (userIds != null) {
        let inserted = await server.mc_subdomain.query(
          "INSERT INTO event_attendance (event_id,user_id) VALUES (?,?)",
          [id, userIds[i]]
        );
      }
    }

    res.json({
      status: "success",
      message: "Attendance Updated",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

module.exports = {
  createEvent: createEvent,
  updateEvent: updateEvent,
  deleteEvent: deleteEvent,
  addEventCode: addEventCode,
  participantsEvent: participantsEvent,
  addParticipant: addParticipant,
};
