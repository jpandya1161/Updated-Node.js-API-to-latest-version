var dateTime = require("node-datetime");
var dt = dateTime.create();

var server = require("../server");
var util = require("util");

let getNavigationBar = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    var nav_obj = await server.mc_subdomain.query(
      "SELECT * FROM installed_module_master WHERE expire_date >= ? AND status = ?",
      [dt.format("Y-m-d"), 1]
    );

    var dashObj = {};

    if (nav_obj.length > 0) {
      for (var i in nav_obj) {
        var sub_module = [];
        if (nav_obj[i]["sub_module_id"] == "root") {
          var subModuleObj = await server.mc_subdomain.query(
            "SELECT * FROM installed_module_master WHERE sub_module_id = ?",
            [nav_obj[i]["module_key"]]
          );
          if (subModuleObj.length > 0) {
            for (var j in subModuleObj) {
              sub_module[j] = subModuleObj[j]["module_name"];
            }
            dashObj[nav_obj[i]["module_name"]] = sub_module;
          } else dashObj[nav_obj[i]["module_name"]] = "root";
        }
        /* else
                {
                    dashObj[nav_obj[i]['module_name']] = nav_obj[i]['module_name']
                }*/
      }
      res.json({
        module_name: dashObj,
        message: "Data Found",
        status: "success",
      });
    } else {
      res.json({
        message: "No Data Found",
        status: "fail",
      });
    }
  } catch (ex) {
    console.log(ex);
    res.json({
      error: ex,
      message: "Something is not right!",
      status: "error",
    });
  }
};

let dashFilter = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let inquiryObj = await server.mc_subdomain.query(
      "SELECT * FROM user_inquiries WHERE DATE(created_at) BETWEEN ? AND ?",
      [
        moment().subtract(7, "days").format("Y-MM-DD"),
        moment().subtract(1, "days").format("Y-MM-DD"),
      ]
    );

    let dates = [];
    for (let i = 7; i > 0; i--) {
      dates.push(moment().subtract(parseInt(i), "days").format("Y-MM-DD"));
    }

    let countInquiryData = {};
    countInquiryData[dates[0]] = 0;
    countInquiryData[dates[1]] = 0;
    countInquiryData[dates[2]] = 0;
    countInquiryData[dates[3]] = 0;
    countInquiryData[dates[4]] = 0;
    countInquiryData[dates[5]] = 0;
    countInquiryData[dates[6]] = 0;

    for (let i in inquiryObj) {
      if (
        moment(inquiryObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
          "Y-MM-DD"
        ) == moment(dates[0], "Y-MM-DD").format("Y-MM-DD")
      )
        countInquiryData[dates[0]]++;
      else if (
        moment(inquiryObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
          "Y-MM-DD"
        ) == moment(dates[1], "Y-MM-DD").format("Y-MM-DD")
      )
        countInquiryData[dates[1]]++;
      else if (
        moment(inquiryObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
          "Y-MM-DD"
        ) == moment(dates[2], "Y-MM-DD").format("Y-MM-DD")
      )
        countInquiryData[dates[2]]++;
      else if (
        moment(inquiryObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
          "Y-MM-DD"
        ) == moment(dates[3], "Y-MM-DD").format("Y-MM-DD")
      )
        countInquiryData[dates[3]]++;
      else if (
        moment(inquiryObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
          "Y-MM-DD"
        ) == moment(dates[4], "Y-MM-DD").format("Y-MM-DD")
      )
        countInquiryData[dates[4]]++;
      else if (
        moment(inquiryObj[i]["created_at"], "Y-MM-DD HH:mm:ss").format(
          "Y-MM-DD"
        ) == moment(dates[5], "Y-MM-DD").format("Y-MM-DD")
      )
        countInquiryData[dates[5]]++;
      else countInquiryData[dates[6]]++;
    }

    let dealObj = await server.mc_subdomain.query(
      "SELECT * FROM user_deals WHERE DATE(created_at) BETWEEN ? AND ?",
      [
        moment().subtract(7, "days").format("Y-MM-DD"),
        moment().subtract(1, "days").format("Y-MM-DD"),
      ]
    );
    dates = [];
    for (let i = 7; i > 0; i--) {
      dates.push(moment().subtract(parseInt(i), "days").format("Y-MM-DD"));
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

    res.json({
      status: "success",
      inquiry_data: countInquiryData,
      deal_data: countDealData,
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

let getTotalGraphData = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let membershipRegistrationObj = await server.mc_subdomain.query(
      'SELECT DATE_FORMAT(start_date,"%Y") AS start-date FROM membership_registration t1,pos_detail t2 WHERE t1.pos_detail_id = t2.id AND DATE_FORMAT(t1.start_date,"%Y") = ? AND t2.module LIKE "Membership"',
      [moment().format("Y")]
    );

    let membershipObj = await server.mc_subdomain.query(
      "SELECT id,membership_name FROM membership_master"
    );

    let moduleIds = [];
    let posObj = await server.mc_subdomain.query(
      'SELECT COUNT(*) AS count,module_id FROM pos_detail WHERE module LIKE "Membership AND id IN (SELECT pos_detail_id FROM membership_registration WHERE DATE_FORMAT(start_date,"%Y") = ?) GROUP BY module_id ORDER BY count DESC LIMIT 5',
      [moment().format("Y")]
    );
    for (let i in posObj) {
      moduleIds.push(posObj[i][""]);
    }
    let membershipGraphObj = await server.mc_subdomain.query(
      'SELECT COUNT(*) AS count,t2.module,DATE_FORMAT(t1.start_date,"%M %Y") AS date FROM membership_registration t1 LEFT JOIN pos_detail t2 ON t1.pos_detail_id = t2.id WHERE t2.module LIKE "Membership" AND t2.module_id IN (?) GROUP BY DATE_FORMAT(start_date,"%M %Y"),t2.module_id',
      [moduleIds]
    );

    let year = moment().format("Y");
    let month = {};
    for (let i = 1; i <= 12; i++) {
      month[moment(year + "-" + i + "-1", "Y-MM-DD").format("MMMM")] = 0;
    }

    let colors = ["#7c5ac2", "#08ddc1", "#ff5e3a", "#ff4897", "#38a9ff"];
    let count = 0;

    for (let i in membershipObj) {
    }
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let saveShortcut = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let data = req.body["data"];
    let shortcutObj = await server.mc_subdomain.query(
      "SELECT * FROM dashboard_shortcuts"
    );
    for (let i in shortcutObj) {
      let updated = await server.mc_subdomain.query(
        "UPDATE dashboard_shortcuts SET enable = ? WHERE id = ?",
        [data[i]["enable"], shortcutObj[i]["id"]]
      );
    }

    res.json({
      status: "success",
      message: "Shortcuts Saved",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let upcomingData = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);
    let userId = req.body["user_id"];
    let isToFilter = req.body["is_to_filter"];

    //Appointment
    let where =
      "WHERE date BETWEEN " +
      moment().format("Y-MM-DD") +
      " AND " +
      moment().add(7, "days").format("Y-MM-DD");
    if (isToFilter) where += "expert_id = ?" + userId;

    let appointmentObj = await server.mc_subdomain.query(
      "SELECT * FROM user_appointment " + where
    );

    let followupObj = await server.mc_subdomain.query(
      "SELECT * FROM user_followup " + where
    );

    let upcomingData = [];

    upcomingData.push({
      title: "Upcoming Appointment",
      count: parseInt(appointmentObj.length) + parseInt(followupObj.length),
      data:
        appointmentObj.length >= 5
          ? appointmentObj.splice(0, 4)
          : appointmentObj + followupObj.splice(0, 5 - appointmentObj.length),
    });

    //Deal Followup
    let dealFollowupObj = await server.mc_subdomain.query(
      "SELECT * FROM user_deals WHERE close_date BETWEEN ? AND ?",
      [moment().format("Y-MM-DD"), moment().add(7, "days").format("Y-MM-DD")]
    );

    upcomingData.push({
      title: "Upcoming Followup",
      count: dealFollowupObj.length,
      data: dealFollowupObj.splice(0, 4),
    });

    //Birthdays
    let birthdayObj = await server.mc_subdomain.query(
      'SELECT *,DATE_FORMAT(birth_date,"%m-%d") AS birth_date FROM user_master WHERE DATE_FORMAT(birth_date,"%m-%d") BETWEEN ? AND ? ORDER BY DATE_FORMAT(birth_date,"%m-%d") ASC',
      [moment().format("MM-DD"), moment().add(7, "days").format("MM-DD")]
    );
    upcomingData.push({
      title: "Upcoming Birthday",
      count: birthdayObj.length,
      data: birthdayObj.splice(0, 4),
    });

    //Recently Payment Collected
    let paymentObj = await server.mc_subdomain.query(
      "SELECT * FROM pos_payment WHERE payment_date BETWEEN ? AND ? ORDER BY id DESC",
      [
        moment().format("Y-MM-DD"),
        moment().subtract(7, "days").format("Y-MM-DD"),
      ]
    );
    upcomingData.push({
      title: "Recent Collections",
      count: paymentObj.length,
      data: paymentObj.splice(0, 4),
    });

    //Recently Expired Membership
    let expiredMembershipObj = await server.mc_subdomain.query(
      "SELECT * FROM membership_registration WHERE end_date BWTWEEN ? AND ?",
      [
        moment().format("Y-MM-DD"),
        moment().subtract(7, "days").format("Y-MM-DD"),
      ]
    );
    upcomingData.push({
      title: "Recent Collections",
      count: expiredMembershipObj.length,
      data: expiredMembershipObj.splice(0, 4),
    });

    //Payment Due
    let duePaymentObj = await server.mc_subdomain.query(
      'SELECT * FROM pos_payment WHERE payment_date < ? AND payment_status = "new"',
      [moment().add(7, "days").format("Y-MM-DD")]
    );
    upcomingData.push({
      title: "Upcoming Payment Due",
      count: duePaymentObj.length,
      data: duePaymentObj.splice(0, 4),
    });

    //Expiring Membership
    let expiringMemberhipObj = await server.mc_subdomain.query(
      "SELECT * FROM membership_registration WHERE end_date BETWEEN ? AND ?",
      [moment().format("Y-MM-DD"), moment().add(7, "days").format("Y-MM-DD")]
    );
    upcomingData.push({
      title: "Upcoming Membership Expires",
      count: expiringMemberhipObj.length,
      data: expiringMemberhipObj.splice(0, 4),
    });

    //Upcoming CLasses
    let classObj = await server.mc_subdomain.query(
      "SELECT * FROM membership_class_master WHERE end_date >= ? OR is_daily = 1",
      [moemnt().format("Y-MM-DD")]
    );

    let graphDate = {};
    graphDate["today_classes_count"] = classObj.length;
    classObj = classObj.splice(0, 4);

    graphDate["todayClasses"] = [];

    for (let i in classObj) {
      let rescheduleObj = await server.mc_subdomain.query(
        "SELECT * FROM reschedule_classes WHERE class_id = ? AND old_date = ? AND old_start_time = ? AND old_end_time = ?",
        [
          classObj[i]["id"],
          moment().format("Y-MM-DD"),
          moment(classObj[i]["start_time"], "HH:mm:ss").format("HH:mm:ss"),
          moment(classObj[i]["end_time"], "HH:mm:ss").format("HH:mm:ss"),
        ]
      );
      if (rescheduleObj.length > 0) {
        classObj[i]["title"] =
          classObj[i]["title"] +
          " rescheduled on " +
          moment(rescheduleObj[0].new_date, "Y-MM-DD").format("DD-MM-Y") +
          " at " +
          moment(rescheduleObj[0]["new_start_time"], "HH:mm:ss").format(
            "hh:mm A"
          );
      }

      if (classObj[i]["days"].split(",").indexOf(moment().format("e")) != -1) {
        classObj[i]["participants"] = await server.mc_subdomain.query(
          "SELECT t2.class_id,COUNT(*) AS count FROM membership_registration t1 LEFT JOIN pos_detail t2 ON t2.id = t1.pos_detail_id WHERE t2.class_id = ?",
          [classObj[i]["id"]]
        );

        if (isToFilter) {
          if (classObj[i]["employee_id"].split(",").indexOf(userId) != -1) {
            graphDate["todayClasses"].push(classObj[i]);
          }
        } else {
          graphDate["todayClasses"].push(classObj[i]);
        }
      }
    }

    upcomingData.push({
      title: "Today Classes",
      count: graphDate["total_classes_count"],
      data: graphDate["todayClasses"],
    });

    res.json({
      status: "success",
      data: upcomingData,
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

let getDashboardGraphs = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let graphName = req.body["graph_name"];
    let time = req.body["time"];

    let filter = {
      time: time,
    };

    switch (graphName) {
      case "inquiry_graph":
    }
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

module.exports = {
  getNavigationBar: getNavigationBar,
  dashFilter: dashFilter,
  getTotalGraphData: getTotalGraphData,
  saveShortcut: saveShortcut,
  upcomingData: upcomingData,
  getDashboardGraphs: getDashboardGraphs,
};
