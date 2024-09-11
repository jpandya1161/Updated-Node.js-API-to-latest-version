var server = require("../server");
var util = require("util");

var moment = require("moment");

let addDeal = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let dealName = req.body["deal_name"];
    let pipeline = req.body["pipe_line"];
    let dealStage = req.body["stage"];
    let closeDate = req.body["close_date"];
    let ownerId = req.body["owner_id"];
    let ownerName = req.body["owner_name"];
    let inquiryId = req.body["customer_id"];
    let userId = req.body["customer"] || 0;
    let contactName = req.body["customer_name"];

    let dealObj = await server.mc_subdomain.query(
      "INSERT INTO user_deals (deal_name,pipeline,deal_stage,close_date,owner_id,owner_name,inquiry_id,user_id,contact_name) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        dealName,
        pipeline,
        dealStage,
        closeDate,
        ownerId,
        ownerName,
        inquiryId,
        userId,
        contactName,
      ]
    );

    res.json({
      status: "success",
      message: "Deal Added",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let updateDeal = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let dealId = req.body["deal_id"];
    let dealStage = req.body["deal_stage"];
    let closeDate = req.body["close_date"];
    let ownerId = req.body["owner_id"];

    let updated = await server.mc_subdomain.query(
      "UPDATE user_deals SET deal_stage = ?,close_date = ?,owner_id = ? WHERE id = ?",
      [dealStage, closeDate, ownerId, dealId]
    );

    res.json({
      status: "success",
      message: "Deal Updated",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let dealFilter = async (req, res, data) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let dealObj = await server.mc_subdomain.query(
      "SELECT * FROM user_deals WHERE DATE(created_at) BETWEEN ? AND ?",
      [
        moment(data, "Y-MM-DD").subtract(7, "days").format("Y-MM-DD"),
        moment(data, "Y-MM-DD").format("Y-MM-DD"),
      ]
    );

    let dates = [];
    for (let i = 7; i > 0; i--) {
      dates.push(moment(data, "Y-MM-DD").subtract(i, "days").format("Y-MM-DD"));
    }

    let countDealData = [
      {
        x: 0,
        y: 0,
      },
      {
        x: 1,
        y: 0,
      },
      {
        x: 2,
        y: 0,
      },
      {
        x: 3,
        y: 0,
      },
      {
        x: 4,
        y: 0,
      },
      {
        x: 5,
        y: 0,
      },
      {
        x: 6,
        y: 0,
      },
    ];

    for (let i in dealObj) {
      if (
        moment(dealObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
          "Y-MM-DD"
        ) == moment(dates[0], "Y-MM-DD").format("Y-MM-DD")
      )
        countDealData[0]["y"]++;
      else if (
        moment(dealObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
          "Y-MM-DD"
        ) == moment(dates[1], "Y-MM-DD").format("Y-MM-DD")
      )
        countDealData[1]["y"]++;
      else if (
        moment(dealObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
          "Y-MM-DD"
        ) == moment(dates[2], "Y-MM-DD").format("Y-MM-DD")
      )
        countDealData[2]["y"]++;
      else if (
        moment(dealObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
          "Y-MM-DD"
        ) == moment(dates[3], "Y-MM-DD").format("Y-MM-DD")
      )
        countDealData[3]["y"]++;
      else if (
        moment(dealObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
          "Y-MM-DD"
        ) == moment(dates[4], "Y-MM-DD").format("Y-MM-DD")
      )
        countDealData[4]["y"]++;
      else if (
        moment(dealObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
          "Y-MM-DD"
        ) == moment(dates[5], "Y-MM-DD").format("Y-MM-DD")
      )
        countDealData[5]["y"]++;
      else countDealData[6]["y"]++;
    }

    return countDealData;

    // res.json({
    //     status : 'success',
    //     data : countDealData,
    //     message : 'Data Found'
    // });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let dealSearch = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let dashFilter = req.body["dash_filter"] || "";
    let search = req.body["search"];
    let loginAs = req.body["login_as"];
    let filter = req.body["filter"];
    let loginId = req.body["login_id"] || "";

    let dealObj = [];
    let dealData = {};
    if (dashFilter != null && dashFilter != "") {
      dealObj = await server.mc_subdomain.query(
        "SELECT * FROM user_deals WHERE DATE(created_at) = ? ORDER BY id DESC LIMIT 10",
        [search]
      );
      for (let i in dealObj) {
        let employeeObj = await server.mc_subdomain.query(
          "SELECT * FROM employee_master WHERE id = ?",
          [dealObj[i]["owner_id"]]
        );
        dealObj[i]["employee_master"] = employeeObj[0];
        let pipelineObj = await server.mc_subdomain.query(
          "SELECT * FROM sales_pipeline WHERE id = ?",
          [dealObj[i]["deal_stage"]]
        );
        dealObj[i]["sales_pipeline"] = pipelineObj[0];
      }

      dealData["deal_data"] = dealObj;

      dealData["today_deals"] = await dealFilter(req, res, search);

      res.json({
        status: "success",
        data: dealData,
        message: "Data Found",
      });
    }

    if (loginAs == "Admin") {
      if (filter == 1) {
        dealObj = await server.mc_subdomain.query(
          "SELECT * FROM user_deals WHERE owner_id = ? ORDER BY id DESC",
          [search]
        );
        for (let i in dealObj) {
          let employeeObj = await server.mc_subdomain.query(
            "SELECT * FROM employee_master WHERE id = ?",
            [dealObj[i]["owner_id"]]
          );
          dealObj[i]["employee_master"] = employeeObj[0];
          let pipelineObj = await server.mc_subdomain.query(
            "SELECT * FROM sales_pipeline WHERE id = ?",
            [dealObj[i]["deal_stage"]]
          );
          dealObj[i]["sales_pipeline"] = pipelineObj[0];
        }
      } else if (filter == 2) {
        dealObj = await server.mc_subdomain.query(
          "SELECT * FROM user_deals WHERE deal_stage = ? ORDER BY id DESC",
          [search]
        );
        for (let i in dealObj) {
          let employeeObj = await server.mc_subdomain.query(
            "SELECT * FROM employee_master WHERE id = ?",
            [dealObj[i]["owner_id"]]
          );
          dealObj[i]["employee_master"] = employeeObj[0];
          let pipelineObj = await server.mc_subdomain.query(
            "SELECT * FROM sales_pipeline WHERE id = ?",
            [dealObj[i]["deal_stage"]]
          );
          dealObj[i]["sales_pipeline"] = pipelineObj[0];
        }
      } else if (filter == 3) {
        dealObj = await server.mc_subdomain.query(
          "SELECT * FROM user_deals WHERE closed = ? ORDER BY id DESC",
          [search]
        );
        for (let i in dealObj) {
          let employeeObj = await server.mc_subdomain.query(
            "SELECT * FROM employee_master WHERE id = ?",
            [dealObj[i]["owner_id"]]
          );
          dealObj[i]["employee_master"] = employeeObj[0];
          let pipelineObj = await server.mc_subdomain.query(
            "SELECT * FROM sales_pipeline WHERE id = ?",
            [dealObj[i]["deal_stage"]]
          );
          dealObj[i]["sales_pipeline"] = pipelineObj[0];
        }
      } else if (filter == 4) {
        let tempObj = await server.mc_subdomain.query(
          'SELECT *,DATE_FORMAT(created_at,"%Y-%m-%d %H:%i:%s") AS created_at FROM user_deals'
        );
        for (let i in tempObj) {
          let employeeObj = await server.mc_subdomain.query(
            "SELECT * FROM employee_master WHERE id = ?",
            [tempObj[i]["owner_id"]]
          );
          tempObj[i]["employee_master"] = employeeObj[0];
          let pipelineObj = await server.mc_subdomain.query(
            "SELECT * FROM sales_pipeline WHERE id = ?",
            [tempObj[i]["deal_stage"]]
          );
          tempObj[i]["sales_pipeline"] = pipelineObj[0];

          if (
            moment(tempObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
              "Y-MM-DD"
            ) == moment(search, "Y-MM-DD").format("Y-MM-DD")
          )
            dealObj.push(tempObj[i]);
        }
      } else if (filter == 5) {
        let tempObj = await server.mc_subdomain.query(
          'SELECT *,DATE_FORMAT(close_date,"%Y-%m-%d") AS close_date FROM user_deals'
        );
        for (let i in tempObj) {
          let employeeObj = await server.mc_subdomain.query(
            "SELECT * FROM employee_master WHERE id = ?",
            [tempObj[i]["owner_id"]]
          );
          tempObj[i]["employee_master"] = employeeObj[0];
          let pipelineObj = await server.mc_subdomain.query(
            "SELECT * FROM sales_pipeline WHERE id = ?",
            [tempObj[i]["deal_stage"]]
          );
          tempObj[i]["sales_pipeline"] = pipelineObj[0];

          if (
            moment(tempObj[i]["close_date"], "Y-MM-DD").format("Y-MM-DD") ==
            moment(search, "Y-MM-DD").format("Y-MM-DD")
          )
            dealObj.push(tempObj[i]);
        }
      } else {
        dealObj = await server.mc_subdomain.query(
          "SELECT * FROM user_deals ORDER BY id DESC"
        );
      }

      res.json({
        status: "success",
        data: dealObj,
        message: "Data Found",
      });
    } else {
      if (filter == 1) {
        dealObj = await server.mc_subdomain.query(
          "SELECT * FROM user_deals WHERE owner_id = ? AND owner_id = ? ORDER BY id DESC",
          [search, loginId]
        );
        for (let i in dealObj) {
          let employeeObj = await server.mc_subdomain.query(
            "SELECT * FROM employee_master WHERE id = ?",
            [dealObj[i]["owner_id"]]
          );
          dealObj[i]["employee_master"] = employeeObj[0];
          let pipelineObj = await server.mc_subdomain.query(
            "SELECT * FROM sales_pipeline WHERE id = ?",
            [dealObj[i]["deal_stage"]]
          );
          dealObj[i]["sales_pipeline"] = pipelineObj[0];
        }
      } else if (filter == 2) {
        dealObj = await server.mc_subdomain.query(
          "SELECT * FROM user_deals WHERE deal_stage = ? AND owner_id = ? ORDER BY id DESC",
          [search, loginId]
        );
        for (let i in dealObj) {
          let employeeObj = await server.mc_subdomain.query(
            "SELECT * FROM employee_master WHERE id = ?",
            [dealObj[i]["owner_id"]]
          );
          dealObj[i]["employee_master"] = employeeObj[0];
          let pipelineObj = await server.mc_subdomain.query(
            "SELECT * FROM sales_pipeline WHERE id = ?",
            [dealObj[i]["deal_stage"]]
          );
          dealObj[i]["sales_pipeline"] = pipelineObj[0];
        }
      } else if (filter == 3) {
        dealObj = await server.mc_subdomain.query(
          "SELECT * FROM user_deals WHERE closed = ? AND owner_id = ? ORDER BY id DESC",
          [search, loginId]
        );
        for (let i in dealObj) {
          let employeeObj = await server.mc_subdomain.query(
            "SELECT * FROM employee_master WHERE id = ?",
            [dealObj[i]["owner_id"]]
          );
          dealObj[i]["employee_master"] = employeeObj[0];
          let pipelineObj = await server.mc_subdomain.query(
            "SELECT * FROM sales_pipeline WHERE id = ?",
            [dealObj[i]["deal_stage"]]
          );
          dealObj[i]["sales_pipeline"] = pipelineObj[0];
        }
      } else if (filter == 4) {
        let tempObj = await server.mc_subdomain.query(
          'SELECT *,DATE_FORMAT(created_at,"%Y-%m-%d %H:%i:%s") AS created_at FROM user_deals WHERE owner_id = ?',
          [loginId]
        );
        for (let i in tempObj) {
          let employeeObj = await server.mc_subdomain.query(
            "SELECT * FROM employee_master WHERE id = ?",
            [tempObj[i]["owner_id"]]
          );
          tempObj[i]["employee_master"] = employeeObj[0];
          let pipelineObj = await server.mc_subdomain.query(
            "SELECT * FROM sales_pipeline WHERE id = ?",
            [tempObj[i]["deal_stage"]]
          );
          tempObj[i]["sales_pipeline"] = pipelineObj[0];

          if (
            moment(tempObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
              "Y-MM-DD"
            ) == moment(search, "Y-MM-DD").format("Y-MM-DD")
          )
            dealObj.push(tempObj[i]);
        }
      } else if (filter == 5) {
        let tempObj = await server.mc_subdomain.query(
          'SELECT *,DATE_FORMAT(close_date,"%Y-%m-%d") AS close_date FROM user_deals WHERE owner_id = ?',
          [loginId]
        );
        for (let i in tempObj) {
          let employeeObj = await server.mc_subdomain.query(
            "SELECT * FROM employee_master WHERE id = ?",
            [tempObj[i]["owner_id"]]
          );
          tempObj[i]["employee_master"] = employeeObj[0];
          let pipelineObj = await server.mc_subdomain.query(
            "SELECT * FROM sales_pipeline WHERE id = ?",
            [tempObj[i]["deal_stage"]]
          );
          tempObj[i]["sales_pipeline"] = pipelineObj[0];

          if (
            moment(tempObj[i]["close_date"], "Y-MM-DD").format("Y-MM-DD") ==
            moment(search, "Y-MM-DD").format("Y-MM-DD")
          )
            dealObj.push(tempObj[i]);
        }
      } else {
        dealObj = await server.mc_subdomain.query(
          "SELECT * FROM user_deals WHERE owner_id = ? ORDER BY id DESC",
          [loginId]
        );
      }

      res.json({
        status: "success",
        data: dealObj,
        message: "Data Found",
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

let dealDetails = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let dealId = req.body["deal_id"];
    let pipelineObj = await server.mc_subdomain.query(
      "SELECT * FROM sales_pipeline"
    );
    for (let i in pipelineObj) {
      let taskObj = await server.mc_subdomain.query(
        "SELECT * FROM sales_notes WHERE deal_id = ? AND column_id = ?",
        [dealId, pipelineObj[i]["id"]]
      );
      pipelineObj[i]["tasks"] = taskObj;
    }

    let activityObj = await server.mc_subdomain.query(
      "SELECT * FROM sales_notes WHERE deal_id = ? ORDER BY created_at DESC"
    );
    let dealObj = await server.mc_subdomain.query(
      'SELECT *,DATE_FORMAT(created_at,"%Y-%m-%d %H:%i:%s") AS created_at FROM user_deals WHERE id = ?',
      [dealId]
    );

    let allHistory = {
      created_at: dealObj[0]["created_at"],
      deal_type: dealObj[0]["deal_name"],
      activity_type: "create",
      type: "deal",
    };

    for (let i in activityObj) {
      activityObj[i]["activity_type"] = "create";
      allHistory.push(activityObj);
    }

    let taskHistoryObj = await server.mc_subdomain.query(
      'SELECT *,DATE_FORMAT(created_at,"%Y-%m-%d %H:%i:%s") AS created_at FROM task WHERE deal_id = ? ORDER BY created_at DESC',
      [dealObj[0]["id"]]
    );
    for (let i in taskHistoryObj) {
      let employeeObj = await server.mc_subdomain.query(
        "SELECT * FROM employee_master WHERE id = ?",
        [taskHistoryObj[i]["employee_id"]]
      );
      taskHistoryObj[i]["employee"] = employeeObj[0];
    }

    let meetingHistoryObj = await server.mc_subdomain.query(
      "SELECT * FROM meeting WHERE deal_id = ? ORDER BY created_at DESC",
      [dealObj[0]["id"]]
    );
    let meetings = [];
    for (let i in meetingHistoryObj) {
      let tempObj = await server.mc_subdomain.query(
        "SELECT user_name FROM employee_master WHERE id IN (?)",
        [meetingHistoryObj[i]["employee_ids"].split(",")]
      );
      let ids = [];
      for (let j in tempObj) {
        ids.push(tempObj[j]["user_name"]);
      }
      meetingHistoryObj[i]["employee_ids"] = ids.join();
      meetings.push(meetingHistoryObj[i]);
    }

    for (let i in taskHistoryObj) {
      taskHistoryObj[i]["activity_type"] = "create";
      taskHistoryObj[i]["type"] = "task";
      allHistory.push(taskHistoryObj[i]);
    }

    // employeeObj = await server.mc_subdomain.query('SELECT * FROM employee_master WHERE status = 1');
    let followupHistoryObj = await server.mc_subdomain.query(
      'SELECT *,DATE_FORMAT(created_at,"%Y-%m-%d %H:%i:%s") AS created_at FROM sales_followup WHERE deal_id = ? ORDER BY created_at DESC',
      [dealObj[0]["id"]]
    );
    for (let i in followupHistoryObj) {
      followupHistoryObj[i]["activity_type"] = "create";
      followupHistoryObj[i]["type"] = "followups";
      allHistory.push(followupHistoryObj[i]);
    }

    res.json({
      status: "success",
      data: allHistory,
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

let updateStage = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let dealId = req.body["deal_id"];
    let dealStage = req.body["deal_stage"];

    let updated = await server.mc_subdomain.query(
      "UPDATE user_deals SET deal_stage = ? WHERE id = ?",
      [dealStage, dealId]
    );

    res.json({
      status: "success",
      message: "Deal Stage Updated",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let addNote = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let type = req.body["note_type"];
    let title = req.body["note_title"];
    let desc = req.body["note_description"];
    let dealId = req.body["deal_id"];
    let dealStage = req.body["deal_stage"];
    let priority = req.body["note_priority"];
    let createdAt =
      req.body["created_at"] || moment().format("Y-MM-DD HH:mm:ss");
    let callTime = req.body["call_time"] || moment().format("Y-MM-DD HH:mm:ss");

    let followupDate = req.body["followup_date"] || moment().format("Y-MM-DD");
    let followTime = req.body["followup_time"] || moment().format("HH:mm:ss");

    let inserted = await server.mc_subdomain.query(
      "INSERT INTO sales_notes (type,title,description,deal_id,column_id,priority,created_at,call_log_data) VALUES (?,?,?,?,?,?,?,?)",
      [type, title, desc, dealId, dealStage, priority, createdAt, callTime]
    );

    inserted = await server.mc_subdomain.query(
      "INSERT INTO sales_followup (deal_id,followup_date,followup_time) VALUES (?,?,?)",
      [dealId, followupDate, followTime]
    );

    res.json({
      status: "success",
      message: "Note And Followup Added Successfully",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let addTask = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let title = req.body["task_title"];
    let desc = req.body["task_description"];
    let dealId = req.body["deal_id"];
    let employeeId = req.body["employee_id"];
    let deadline = req.body["dead_line"];
    let createdAt = req.body["created_at"];

    let inserted = await server.mc_subdomain.query(
      "INSERT INTO task (title,description,deal_id,employee_id,deal_line,created_at) VALUES (?,?,?,?,?)",
      [title, desc, dealId, employeeId, deadline, createdAt]
    );

    res.json({
      status: "success",
      message: "Task Added",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let getSingleNote = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];
    let noteObj = await server.mc_subdomain.query(
      "SELECT * FROM sales_notes WHERE id = ?",
      [id]
    );
    if (noteObj.length > 0) {
      res.json({
        status: "success",
        data: noteObj,
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

let deleteSingleNote = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];
    let deleted = await server.mc_subdomain.query(
      "DELETE FROM sales_notes WHERE id = ?",
      [id]
    );

    res.json({
      status: "success",
      message: "Note Deleted",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let editSingleNote = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];
    let type = req.body["note_type"];
    let title = req.body["note_title"];
    let desc = req.body["note_description"];
    let priority = req.body["note_priority"];

    let updated = await server.mc_subdomain.query(
      "UPDATE sales_notes SET type = ?,title = ?,description = ?, priority = ? WHERE id = ?",
      [type, title, desc, priority, id]
    );

    res.json({
      status: "success",
      message: "Note Updated",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let closeDeal = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let dealId = req.body["deal_id"];

    let updated = await server.mc_subdomain.query(
      "UPDATE user_deal SET closed = 1 WHERE id = ?",
      [dealId]
    );

    res.json({
      status: "success",
      message: "Deal Closed Successfully",
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
  addDeal: addDeal,
  updateDeal: updateDeal,
  dealSearch: dealSearch,
  dealDetails: dealDetails,
  updateStage: updateStage,
  addNote: addNote,
  addTask: addTask,
  getSingleNote: getSingleNote,
  deleteSingleNote: deleteSingleNote,
  editSingleNote: editSingleNote,
  closeDeal: closeDeal,
};
