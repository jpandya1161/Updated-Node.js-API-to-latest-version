var util = require("util");
var server = require("../server");

var getInquiryChart = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var inquiryObj = await server.mc_subdomain.query(
        "SELECT COUNT(*) AS count,inquiry_type FROM user_inquiries WHERE created_at <= NOW() GROUP BY inquiry_type"
      );
      if (inquiryObj.length > 0) {
        var total = 0;
        for (var i in inquiryObj) total += inquiryObj[i]["count"];

        res.json({
          graph_data: inquiryObj,
          total_count: total,
          message: "Data Found",
          status: "success",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "Something is not right",
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

var getMembersChart = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var activeUsers = 0,
        expiredUsers = 0,
        frozenUsers = 0,
        notStartedUsers = 0;
      var inquiryList = [];
      var userList = [];
      var currentDate = new Date().toJSON().slice(0, 10);

      /*get active members*/
      var userActiveObj = await server.mc_subdomain.query(
        "SELECT COUNT(*) AS total_active,email FROM user_master WHERE join_date <= ? AND expire_date >= ?",
        [currentDate, currentDate]
      );
      if (userActiveObj.length > 0)
        activeUsers = userActiveObj[0]["total_active"];

      /*get membership expired member*/
      var userExpiredObj = await server.mc_subdomain.query(
        "SELECT COUNT(*) AS total_expired,email FROM user_master WHERE expire_date < ?",
        [currentDate]
      );
      if (userExpiredObj.length > 0)
        expiredUsers = userExpiredObj[0]["total_expired"];

      /*get Frozen member : inquiry done but not join*/
      var inquiryObj = await server.mc_subdomain.query(
        "SELECT email FROM user_inquiries"
      );
      if (inquiryObj.length > 0) {
        for (var i in inquiryObj) inquiryList[i] = inquiryObj[i]["email"];
      }
      var userObj = await server.mc_subdomain.query(
        "SELECT email FROM user_master"
      );
      if (userObj.length > 0) {
        for (var i in userObj) userList[i] = userObj[i]["email"];
      }
      for (var i in inquiryList) {
        if (userList.indexOf(inquiryList[i]) == -1) frozenUsers += 1;
      }

      /*get not-started members : membership buy but joining date is grater then current date*/
      var notStartedUsersObj = await server.mc_subdomain.query(
        "SELECT COUNT(*) AS not_started FROM membership_registration WHERE start_date > ?",
        [currentDate]
      );
      if (notStartedUsersObj.length > 0)
        notStartedUsers = notStartedUsersObj[0]["not_started"];

      var totalUsers =
        activeUsers + expiredUsers + frozenUsers + notStartedUsers;

      res.json({
        total_active: activeUsers,
        total_expired: expiredUsers,
        total_frozen: frozenUsers,
        total_not_started: notStartedUsers,
        total_count: totalUsers,
        message: "Data Found",
        status: "success",
      });
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "Something is not right",
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

var getRevenueChart = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      let Config = require("../config/constants").getConstants();

      server.mc_superadmin.query = util.promisify(server.mc_superadmin.query);
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var currentDate = new Date().toJSON().slice(0, 10);

      var totalCount = 0;
      var totalEarning = 0;

      var posObj = await server.mc_subdomain.query(
        "SELECT COUNT(*) AS total, SUM(paying) AS earning, module FROM pos_detail t1 LEFT JOIN pos_master t2 ON t1.pos_id = t2.id WHERE t1.created_at <= ? GROUP BY module",
        [currentDate]
      );
      if (posObj.length > 0) {
        expertCurrencySymbol = "$"; //Default Currency Symbol
        var expertObj = await server.mc_superadmin.query(
          "SELECT id FROM expert_master WHERE subdomain = ?",
          [global.subdomain]
        );
        var expertId = expertObj[0]["id"];

        var getExpertCurrency = await server.mc_superadmin.query(
          "SELECT currency_code FROM expert_detail WHERE expert_id = ?",
          [expertId]
        );
        var expertCurrencyDetail =
          Config["currency"][getExpertCurrency[0]["currency_code"]];

        if (Object.keys(expertCurrencyDetail).length > 0)
          expertCurrencySymbol = expertCurrencyDetail[1];

        for (var i in posObj) {
          totalCount += posObj[i]["total"];
          totalEarning += posObj[i]["earning"];
        }

        totalEarning = expertCurrencySymbol + " " + totalEarning;

        res.json({
          graph_data: posObj,
          currencySymbol: expertCurrencySymbol,
          total_count: totalCount,
          total_earning: totalEarning,
          message: "Data Found",
          status: "success",
        });
      } else {
        res.json({
          message: "No Data Found",
          status: "fail",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "Something is not right",
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

var getMembershipChart = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var currentDate = new Date().toJSON().slice(0, 10);

      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var membershipObj = await server.mc_subdomain.query(
        "SELECT COUNT(*) AS count,membership_id,membership_name FROM membership_registration t1 LEFT JOIN membership_master t2 ON t2.id = t1.membership_id WHERE start_date <= ? GROUP BY membership_id",
        [currentDate]
      );
      if (membershipObj.length > 0) {
        var totalCount = 0;
        for (var i in membershipObj) totalCount += membershipObj[i]["count"];

        res.json({
          graph_data: membershipObj,
          total_count: totalCount,
          message: "Data Found",
          status: "success",
        });
      } else {
        res.json({
          message: "No Data Found",
          status: "fail",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "Something is not right",
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

var getAgeGroupChart = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var ageObj = {};
      var userObj = await server.mc_subdomain.query(
        "SELECT id,birth_date FROM user_master WHERE status = 1"
      );
      if (userObj.length > 0) {
        var teenage = 0;
        var adult = 0;
        var senior = 0;
        for (var i in userObj) {
          if (userObj[i]["birth_date"] != null) {
            var d1 = new Date();
            var d2 = new Date(userObj[i]["birth_date"]);

            var age = Math.floor((d1.getTime() - d2.getTime()) / 31557600000);

            if (age >= 5 && age <= 20) teenage += 1;
            else if (age >= 21 && age <= 40) adult += 1;
            else if (age >= 41) senior += 1;
          }
        }

        ageObj["between 5-20"] = teenage;
        ageObj["between 21-40"] = adult;
        ageObj["above 40"] = senior;
        var total = teenage + adult + senior;
        res.json({
          age_group: ageObj,
          total_count: total,
          message: "Data Found",
          status: "success",
        });
      } else {
        res.json({
          message: "No Data Found",
          status: "fail",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "Something is not right",
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

var getMembershipByTimeChart = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);
      var membershipObj = await server.mc_subdomain.query(
        "SELECT t1.membership_id,t2.period FROM membership_registration t1 LEFT JOIN membership_master t2 ON t1.membership_id = t2.id"
      );

      if (membershipObj.length > 0) {
        var group1 = 0;
        var group2 = 0;
        var group3 = 0;
        var group4 = 0;
        var membershipCount = {};

        for (var i in membershipObj) {
          if (membershipObj[i]["period"] <= 90) group1 += 1;
          else if (
            membershipObj[i]["period"] >= 91 &&
            membershipObj[i]["period"] <= 180
          )
            group2 += 1;
          else if (
            membershipObj[i]["period"] >= 181 &&
            membershipObj[i]["period"] <= 365
          )
            group3 += 1;
          else if (membershipObj[i]["period"] >= 366) group4 += 1;
        }

        membershipCount["<=3"] = group1;
        membershipCount["3-6"] = group2;
        membershipCount["6-12"] = group3;
        membershipCount[">12"] = group4;

        var total = group1 + group2 + group3 + group4;

        res.json({
          graph_data: membershipCount,
          total_count: total,
          message: "Data Found",
          status: "success",
        });
      } else {
        res.json({
          message: "No Data Found",
          status: "fail",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "Something is not right",
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

var getMembershipExpiredChart = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var moment = require("moment");
      var date = new Date().getFullYear() + "-01-01";
      var start = moment(date);
      var end = moment(new Date());
      var expiredObj = await server.mc_subdomain.query(
        "SELECT COUNT(*) AS total,MONTH(end_date) AS month FROM membership_registration WHERE end_date < NOW() AND end_date >= ? GROUP BY MONTH(end_date)",
        [date]
      );
      if (expiredObj.length > 0) {
        var months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        monthArray = [];
        var totalCount = 0;
        for (var k in expiredObj) {
          monthArray[k] = expiredObj[k]["month"];
          totalCount += expiredObj[k]["total"];
        }

        var graph_data = [];
        var i = 0;
        var j = 0;
        while (end > start) {
          if (monthArray.indexOf(start.month() + 1) != -1) {
            expiredObj[j]["month"] = months[start.month()];
            graph_data[i] = expiredObj[j];
            j++;
          } else {
            var temp = {};
            temp["total"] = 0;
            temp["month"] = months[start.month()];
            graph_data[i] = temp;
          }
          i++;
          start.add(1, "month");
        }

        res.json({
          graph_data: graph_data,
          total_count: totalCount,
          message: "Data Found",
          status: "success",
        });
      } else {
        res.json({
          message: "No Data Found",
          status: "fail",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "Something is not right",
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

var getAppUserChart = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var currentDate = new Date().toJSON().slice(0, 10);

      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);
      var androidObj = await server.mc_subdomain.query(
        "SELECT COUNT(*) AS count FROM register_app_master WHERE register_date <= ? AND status = 1",
        [currentDate]
      );
      var iosObj = await server.mc_subdomain.query(
        "SELECT COUNT(*) AS count FROM tbl_ios_reg_users WHERE reg_date <= ? AND status = 1",
        [currentDate]
      );

      var total = 0;
      if (androidObj.length > 0) {
        if (iosObj.length > 0)
          total = androidObj[0]["count"] + iosObj[0]["count"];
        else iosObj[0]["count"] = 0;
      } else {
        androidObj[0]["count"] = 0;
      }

      res.json({
        android_count: androidObj[0]["count"],
        ios_count: iosObj[0]["count"],
        total_count: total,
        message: "Data Found",
        status: "success",
      });
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "Something is not right",
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

var getRevenueHistoryChart = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      let Config = require("../config/constants").getConstants();

      var months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      var currentDate = new Date().toJSON().slice(0, 10);

      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);
      var posObj = await server.mc_subdomain.query(
        "SELECT MONTH(created_at) AS month,SUM(paying) AS total FROM pos_master WHERE date(created_at) <= NOW() GROUP BY MONTH(created_at)"
      );
      if (posObj.length > 0) {
        expertCurrencySymbol = "$"; //Default Currency Symbol
        var expertObj = await server.mc_superadmin.query(
          "SELECT id FROM expert_master WHERE subdomain = ?",
          [global.subdomain]
        );
        var expertId = expertObj[0]["id"];

        var getExpertCurrency = await server.mc_superadmin.query(
          "SELECT currency_code FROM expert_detail WHERE expert_id = ?",
          [expertId]
        );
        var expertCurrencyDetail =
          Config["currency"][getExpertCurrency[0]["currency_code"]];

        if (Object.keys(expertCurrencyDetail).length > 0)
          expertCurrencySymbol = expertCurrencyDetail[1];

        var monthArray = [];
        var total = 0;
        for (var i in posObj) {
          monthArray[i] = posObj[i]["month"];
          total += posObj[i]["total"];
        }
        total = expertCurrencySymbol + " " + total;

        var moment = require("moment");
        var start = moment(new Date().getFullYear() + "-01-01");
        var end = moment(new Date().getFullYear() + "-12-31");

        var graph_data = [];
        var i = 0;
        var j = 0;
        while (end > start) {
          if (monthArray.indexOf(start.month() + 1) != -1) {
            posObj[j]["month"] = months[start.month()];
            graph_data[i] = posObj[j];
            j++;
          } else {
            var temp = {};
            temp["month"] = months[start.month()];
            temp["total"] = 0;
            graph_data[i] = temp;
          }
          i++;
          start.add(1, "month");
        }

        res.json({
          graph_data: graph_data,
          total_count: total,
          message: "Data Found",
          status: "success",
        });
      } else {
        res.json({
          message: "No Data Found",
          status: "fail",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "Something is not right",
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

var getPersonalTrainingChart = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);
      var posObj = await server.mc_subdomain.query(
        "SELECT COUNT(*) AS total,name,module_id FROM pos_detail WHERE module = ? AND created_at <= NOW() GROUP BY module_id",
        ["Personal Training"]
      );

      var totalCount = 0;
      if (posObj.length > 0) {
        for (var i in posObj) totalCount += posObj[i]["total"];

        res.json({
          graph_data: posObj,
          total_count: totalCount,
          message: "Data Found",
          status: "success",
        });
      } else {
        res.json({
          message: "No Data Found",
          status: "fail",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "Something is not right",
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

var getConsultantsSalesChart = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);
      var posObj = await server.mc_subdomain.query(
        'SELECT employee_id,SUM(paying) AS total,user_name AS employee_name FROM pos_master t1 LEFT JOIN employee_master t2 ON t1.employee_id = t2.id WHERE employee_id != "" AND t1.created_at <= NOW() GROUP BY employee_id'
      );
      if (posObj.length > 0) {
        var totalCount = 0;
        for (var i in posObj) {
          totalCount += posObj[i]["total"];
          if (posObj[i]["employee_id"] == "Admin")
            posObj[i]["employee_name"] = "Admin";
        }

        res.json({
          graph_data: posObj,
          total_count: totalCount,
          message: "Data Found",
          status: "success",
        });
      } else {
        res.json({
          message: "No Data Found",
          status: "fail",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "Something is not right",
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

var getPaymentEfficiencyChart = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      let Config = require("../config/constants").getConstants();

      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);
      var posObj = await server.mc_subdomain.query(
        "SELECT SUM(paying) AS total,payment_option FROM pos_master WHERE created_at <= NOW() GROUP BY payment_option"
      );
      if (posObj.length > 0) {
        expertCurrencySymbol = "$"; //Default Currency Symbol
        var expertObj = await server.mc_superadmin.query(
          "SELECT id FROM expert_master WHERE subdomain = ?",
          [global.subdomain]
        );
        var expertId = expertObj[0]["id"];

        var getExpertCurrency = await server.mc_superadmin.query(
          "SELECT currency_code FROM expert_detail WHERE expert_id = ?",
          [expertId]
        );
        var expertCurrencyDetail =
          Config["currency"][getExpertCurrency[0]["currency_code"]];

        if (Object.keys(expertCurrencyDetail).length > 0)
          expertCurrencySymbol = expertCurrencyDetail[1];

        var totalCount = 0;
        for (var i in posObj) totalCount += posObj[i]["total"];

        totalCount = expertCurrencySymbol + " " + totalCount;
        res.json({
          graph_data: posObj,
          total_count: totalCount,
          message: "Data Found",
          status: "success",
        });
      } else {
        res.json({
          message: "No Data Found",
          status: "fail",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "Something is not right",
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

module.exports = {
  getInquiryChart: getInquiryChart,
  getMembersChart: getMembersChart,
  getRevenueChart: getRevenueChart,
  getMembershipChart: getMembershipChart,
  getAgeGroupChart: getAgeGroupChart,
  getMembershipByTimeChart: getMembershipByTimeChart,
  getMembershipExpiredChart: getMembershipExpiredChart,
  getAppUserChart: getAppUserChart,
  getRevenueHistoryChart: getRevenueHistoryChart,
  getPersonalTrainingChart: getPersonalTrainingChart,
  getConsultantsSalesChart: getConsultantsSalesChart,
  getPaymentEfficiencyChart: getPaymentEfficiencyChart,
};
