const server = require("../server");
const util = require("util");

const moment = require("moment");

const planQuery = require("../models/PlanQuery");

let botsIndex = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    resp = [];

    let botObj = await server.mc_subdomain.query(
      "SELECT * FROM botes_questions_master"
    );

    for (let i in botObj) {
      resp[i] = {
        id: botObj[i]["id"],
      };
      if (botObj[i]["who_added"].toLowerCase() == "admin") {
        resp[i]["who_added"] = botObj[i]["who_added"];
      } else {
        let employeeObj = await server.mc_subdomain.query(
          "SELECT * FROM employee_master WHERE id = ? AND status = 1",
          [botObj[i]["who_added"]]
        );

        resp[i]["who_added"] = employeeObj[0];
        resp[i]["who_added"] = botObj[i]["who_added"];
        resp[i]["when_fire"] = botObj[i]["when_fire"];
        resp[i]["questions"] = botObj[i]["questions"];
        resp[i]["status"] = botObj[i]["status"];
      }
    }

    res.json({
      status: "success",
      data: resp,
      message: "Data Found",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let viewAnswers = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let resp = [];
    let loginAs = req.body["login_as"];

    if (loginAs.toLowerCase() == "admin") {
      let botObj = await server.mc_subdomain.query(
        "SELECT * FROM botes_answer_master"
      );
      for (let i in botObj) {
        resp[i] = {
          id: botObj[i]["id"],
        };

        let quesObj = await server.mc_subdomain.query(
          "SELECT * FROM botes_questions_master WHERE id = ? AND status = 1",
          [botObj[i]["question_id"]]
        );
        resp[i]["question_id"] = quesObj[0];

        let userObj = await server.mc_subdomain.query(
          "SELECT * FROM user_master WHERE id = ? AND status = 1",
          [botObj[i]["user_id"]]
        );
        resp[i]["user_id"] = userObj[0];
        if (botObj[i]["answer"] != null || botObj[i]["answer"] == "") {
          resp[i]["answer"] = botObj[i]["answer"];
        } else {
          resp[i]["answer"] = "-";
        }

        resp[i]["when_ans"] = moment(
          botObj[i]["when_ans"],
          "Y-MM-DD HH:mm:ss"
        ).format("H:i:s DD/MM/Y");
        resp[i]["status"] = botObj[i]["status"];
      }
    } else {
      let answers = [];
      let userObj = await server.mc_subdomain.query(
        "SELECT * FROM user_master WHERE employee_id = ? AND status = 1",
        [loginAs]
      );
      for (let i in userObj) {
        let ansObj = await server.mc_subdomain.query(
          "SELECT * FROM botes_answer_master WHERE user_id = ? AND status = 1",
          [userObj[i]["id"]]
        );
        answers[i] = ansObj[0];
      }

      for (let i in answers) {
        let quesObj = await server.mc_subdomain.query(
          "SELECT * FROM botes_questions_master WHERE id = ? AND status = 1",
          [answers[i]["question_id"]]
        );
        let userObj = await server.mc_subdomain.query(
          "SELECT * FROM user_master WHERE id = ? AND status = 1",
          [answers[i]["user_id"]]
        );

        resp[i]["id"] = {
          id: answers[i]["id"],
          question_id: quesObj[0],
          user_id: userObj[0],
        };

        if (answers[i]["answer"] != null && answers[i]["answer"] != "")
          resp[i]["answer"] = answers[i]["answer"];
        else resp[i]["answer"] = "-";

        resp[i]["when_ans"] = moment(
          answers[i]["when_ans"],
          "Y-MM-DD HH:mm:ss"
        ).format("H:i:s DD/MM/Y");
        resp[i]["status"] = answers[i]["status"];
      }
    }

    res.json({
      status: "success",
      data: resp,
      message: "Data Found",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let addQuestion = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let botQues = req.body["bot_question"];
    let fireDate = req.body["fire_date"];
    let status = req.body["status"];

    let name = req.body["name"];
    let loginAs = req.body["login_as"];

    let inserted = await server.mc_subdomain.query(
      "INSERT INTO botes_questions_master (questions,who_added,when_fire,status) VALUES (?,?,?,?)",
      [botQues, loginAs, fireDate, status]
    );
    let insertedId = await server.mc_subdomain.query(
      "SELECT LAST_INSERT_ID() AS id"
    );

    /*-------------------------Notification start here---------------------------------------*/

    let notify = {
      start_time: moment(fireDate, "Y-MM-DD HH:mm:ss").format("HH:mm:ss"),
      date: moment(fireDate, "Y-MM-DD HH:mm:ss").format("Y-MM-DD"),
      key_value: "bot" + insertedId[0]["id"],
      title: "Simplyloose Bots",
      message: "Simplyloose Bot waiting for your answer",
      url: "bots/",
      name: name,
      role: loginAs.toLowerCase() == "admin" ? "Admin" : "Expert",
      image:
        "https://logic.simplyloose.com/assets/images/expert/logo_helpdesk.png",
      status: 0,
    };

    await planQuery.insertForAllFixedNotification(notify);

    res.json({
      status: "success",
      message: "Question Added",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let changeQuestionStatus = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let updated = await server.mc_subdomain.query(
      "UPDATE botes_questions_master SET status = ? WHERE id = ?",
      [req.body.status, req.body.id]
    );

    res.json({
      status: "success",
      message: "Status Changed",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};
let deleteQuestion = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let deleted = await server.mc_subdomain.query(
      "DELETE FROM botes_questions_master WHERE id = ?",
      [req.body.id]
    );

    res.json({
      status: "success",
      message: "Question Deleted",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let updateQuestion = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let updated = await server.mc_subdomain.query(
      "UPDATE botes_questions_master SET questions = ? WHERE id = ?",
      [req.body["question"], req.body["id"]]
    );

    res.json({
      status: "success",
      message: "Status Changed",
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
  botsIndex: botsIndex,
  viewAnswers: viewAnswers,
  addQuestion: addQuestion,
  changeQuestionStatus: changeQuestionStatus,
  deleteQuestion: deleteQuestion,
  updateQuestion: updateQuestion,
};
