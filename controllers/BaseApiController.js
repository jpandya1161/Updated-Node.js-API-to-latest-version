let server = require("../server");
let util = require("util");
let Config = require("../config/constants").getConstants();

server.mc_superadmin.query = util.promisify(server.mc_superadmin.query);

let getExpertsModuleList = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var subModuleKeyList = [];
      var moduleList = await server.mc_subdomain.query(
        "SELECT id,module_name,module_key,sub_module_id FROM installed_module_master WHERE status = 1"
      );

      var i = 0;
      for (var ind in moduleList) {
        if (moduleList[ind]["sub_module_id"] != "root") {
          subModuleKeyList[i] = moduleList[ind]["sub_module_id"];
          i++;
        }
      }

      subModuleKeyList = new Set(subModuleKeyList); //remove duplicates
      subModuleKeyList = [...subModuleKeyList]; //convert Set to Array

      for (var ind in moduleList)
        if (subModuleKeyList.indexOf(moduleList[ind]["module_key"]) != -1)
          moduleList.splice(ind, 1);

      var professionList = await server.mc_subdomain.query(
        "SELECT id,professional_name FROM professional_master WHERE status = 1"
      );

      console.log();
      res.json({
        moduleList: moduleList,
        professionList: professionList,
        massage: "Data Found",
        status: "success",
      });
    } catch (ex) {
      console.log(ex);
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

let getExpertPlanList = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var expertCurrencySymbol = "$"; // Default Currency USD

      var data = await server.mc_superadmin.query(
        "SELECT id FROM expert_master WHERE subdomain = ?",
        [global.subdomain]
      );
      var expert_id = data[0]["id"];

      var getExpertCurrency = await server.mc_superadmin.query(
        "SELECT currency_code FROM expert_detail WHERE expert_id = ?",
        [expert_id]
      );

      if (getExpertCurrency.length > 0)
        expertCurrencySymbol =
          Config["currency"][getExpertCurrency[0]["currency_code"]]["1"];
      var planList = await server.mc_subdomain.query(
        "SELECT id,plan_name, price,is_free FROM plan_master WHERE status = 1"
      );
      // var employeeList = await server.mc_subdomain.query('SELECT em.id,em.user_name,em.profession_id,pm.professional_name,pm.icon_image,pm.status FROM employee_master em LEFT JOIN professional_master pm ON em.profession_id = pm.id WHERE em.status = 1 ORDER BY em.profession_id,em.user_name');

      var employeeList = await server.mc_subdomain.query(
        "SELECT id,user_name,profession_id FROM employee_master WHERE status = 1 ORDER BY profession_id,user_name"
      );
      for (var i in employeeList) {
        var professionList = await server.mc_subdomain.query(
          "SELECT * FROM professional_master WHERE id = ?",
          [employeeList[i]["profession_id"]]
        );
        employeeList[i]["employee_profession"] = professionList[0];
      }
      res.json({
        planList: planList,
        employeeList: employeeList,
        currencySymbol: expertCurrencySymbol,
        massage: "Plan Found",
        status: "success",
      });
    } catch (e) {
      console.log(e);
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

let checkEmail = async (req, res) => {
  console.log(req.body);
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    var emailId = req.body.email;
    var checkMail = await server.mc_superadmin.query(
      "SELECT * FROM register_master WHERE email = ?",
      [emailId]
    );

    if (checkMail.length == 0) {
      res.json({
        massage: "Email not found",
        status: "success",
      });
    } else {
      res.json({
        massage: "Email Already Registered!",
        status: "fail",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

let getExpertNotification = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var dateTime = require("node-datetime");
      var dt = dateTime.create();

      var limit = req.query["filter.limit"] || 15;
      var skip = req.query["filter.skip"] || 0;

      var notificationList = await server.mc_subdomain.query(
        'SELECT *,DATE_FORMAT(date,"%Y-%m-%d") as date FROM web_notification_center_expert WHERE date <= ? ORDER BY date DESC LIMIT ? OFFSET ?',
        [dt.format("Y-m-d"), limit, skip]
      );

      if (notificationList.length > 0) {
        for (var i in notificationList) {
          /*remove notification that have greater time then current*/
          if (
            notificationList[i]["date"] == dt.format("Y-m-d") &&
            notificationList[i]["time"] == dt.format("H-i-s")
          )
            notificationList.splice(i, 1);
        }

        for (var i in notificationList) {
          if (notificationList[i]["role"] == "user") {
            roleDetail = await server.mc_subdomain.query(
              "SELECT id,user_name,first_name,last_name,email,profile_image FROM user_master WHERE id = ?",
              [notificationList[i]["role_id"]]
            );
            notificationList[i]["roleDetail"] = roleDetail[0];
          } else if (notificationList[i]["role"] == "employee") {
            roleDetail = await server.mc_subdomain.query(
              "SELECT user_name,email FROM employee_master WHERE id = ?",
              [notificationList[i]["role_id"]]
            );
            roleDetail[0]["first_name"] = "";
            roleDetail[0]["last_name"] = "";
            roleDetail[0]["profile_image"] = "";
            notificationList[i]["roleDetail"] = roleDetail[0];
          } else {
            var roleDetail = {
              user_name: "simplyloose",
              first_name: "simply",
              last_name: "loose",
              email: "",
              profile_image: "",
            };
            notificationList[i]["role_detail"] = roleDetail;
          }
        }
        res.json({
          notificationList: notificationList,
          massage: "Notification Found",
          status: "success",
        });
      } else {
        res.json({
          massage: "No new Notification Found",
          status: "fail",
        });
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

module.exports = {
  getExpertsModuleList: getExpertsModuleList,
  getExpertPlanList: getExpertPlanList,
  checkEmail: checkEmail,
  getExpertNotification: getExpertNotification,
};
