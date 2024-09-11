let server = require("../server");
let util = require("util");

server.mc_superadmin.query = util.promisify(server.mc_superadmin.query);

var dateTime = require("node-datetime");
var dt = dateTime.create();

const Serialize = require("php-serialize");
const moment = require("moment-timezone");

let getEmployees = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var employeeList = await server.mc_subdomain.query(
        'SELECT *,DATE_FORMAT(join_date,"%Y-%m-%d") as join_date FROM employee_master ORDER BY user_name ASC'
      );

      if (employeeList.length > 0) {
        for (var i in employeeList) {
          var professionObj = await server.mc_subdomain.query(
            "SELECT * FROM professional_master WHERE id = ?",
            [employeeList[i]["profession_id"]]
          );
          employeeList[i]["employee_profession"] = professionObj[0];
        }

        res.json({
          employeeList: employeeList,
          message: "Data Found",
          status: "success",
        });
      } else {
        res.json({
          message: "Data Not Found",
          status: "fail",
        });
      }
    } catch (ex) {
      console.log(ex);
      res.json({
        error: ex,
        status: "error",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

let getEmployeeDetail = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var id = req.params.id;
      var employeePermissions = [];
      var moduleList = null;

      var getEmployeeDetail = await server.mc_subdomain.query(
        'SELECT *,DATE_FORMAT(join_date,"%Y-%m-%d") as join_date FROM employee_master WHERE id = ?',
        [id]
      );
      var employee_profession = await server.mc_subdomain.query(
        "SELECT * FROM professional_master WHERE id = ?",
        [getEmployeeDetail[0]["profession_id"]]
      );
      getEmployeeDetail[0]["employee_profession"] = employee_profession[0];

      if (getEmployeeDetail.length > 0) {
        var permissionArray = getEmployeeDetail[0]["permission"];
        permissionArray = Serialize.unserialize(permissionArray);

        var data = await server.mc_subdomain.query(
          "SELECT id FROM installed_module_master WHERE id IN (?)",
          [Object.values(permissionArray)]
        );
        for (var i in data) employeePermissions[i] = data[i]["id"];

        var moduleList = await server.mc_subdomain.query(
          "SELECT id,module_name FROM installed_module_master WHERE status = ? AND module_name != ? AND module_name != ? AND module_name != ?",
          [1, "Payment", "Schedule", "Setting"]
        );

        for (var i in moduleList) {
          moduleList[i]["isAssigned"] = 0;
          if (employeePermissions.indexOf(moduleList[i]["id"]) != -1)
            moduleList[i]["isAssigned"] = 1;
        }
      }

      if (getEmployeeDetail.length < 1) {
        return res.json({
          employeeDetail: null,
          employeePermissions: null,
          message: "No Employee Found",
          status: "fail",
        });
      } else {
        return res.json({
          employeeDetail: getEmployeeDetail[0],
          employeePermissions: moduleList,
          message: "Employee Found",
          status: "success",
        });
      }
    } catch (ex) {
      console.log(ex);
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

let updateEmployeesModuleStatus = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var employeeId = req.body.employee_id;
      var status = req.body.status;
      var moduleId = parseInt(req.body.moduleId, 10);
      var employeePermissions = [];

      var getEmployeeDetail = await server.mc_subdomain.query(
        "SELECT * FROM employee_master WHERE id = ?",
        [employeeId]
      );
      var permissionArray = getEmployeeDetail[0]["permission"];
      permissionArray = Serialize.unserialize(permissionArray);
      permission = Object.values(permissionArray);

      var data = await server.mc_subdomain.query(
        "SELECT id FROM installed_module_master WHERE id IN (?)",
        [permission]
      );
      for (var i in data) employeePermissions[i] = data[i]["id"];

      var moduleObj = await server.mc_subdomain.query(
        "SELECT * FROM installed_module_master WHERE id = ?",
        [moduleId]
      );

      /*Check if module is root module*/
      if (moduleObj[0]["sub_module_id"] == "root") {
        if (status == 1) {
          if (permission.indexOf(moduleId) == -1)
            permission.push(parseInt(moduleId, 10));
        } else {
          if (permission.indexOf(moduleId) != -1)
            permission.splice(permission.indexOf(moduleId), 1);
        }
      } else {
        var moduleList = [];
        data = await server.mc_subdomain.query(
          "SELECT id FROM installed_module_master WHERE sub_module_id = ?",
          [moduleObj[0]["sub_module_id"]]
        );
        for (var i in data) moduleList[i] = data[i]["id"];

        var _ = require("underscore");
        if (status == 1) {
          if (_.intersection(moduleList, employeePermissions).length < 1) {
            var rootModuleId = await server.mc_subdomain.query(
              "SELECT id FROM installed_module_master WHERE module_key = ?",
              [moduleObj[0]["sub_module_id"]]
            );
            if (permission.indexOf(rootModuleId[0]["id"]) == -1)
              permission.push(parseInt(rootModuleId[0]["id"], 10));
          }
          if (permission.indexOf(moduleId) == -1)
            permission.push(parseInt(moduleId, 10));
        } else {
          if (permission.indexOf(moduleId) != -1)
            permission.splice(permission.indexOf(moduleId), 1);

          if (_.intersection(moduleList, employeePermissions).length == 0) {
            var rootModuleId = await server.mc_subdomain.query(
              "SELECT id FROM installed_module_master WHERE module_key = ?",
              [moduleObj[0]["sub_module_id"]]
            );
            if (permission.indexOf(rootModuleId[0]["id"]) != -1)
              permission.splice(permission.indexOf(rootModuleId[0]["id"]), 1);
          }
        }
      }
      var permissionString = Serialize.serialize(permission);

      var inserted = await server.mc_subdomain.query(
        "UPDATE employee_master SET permission = ? WHERE id = ?",
        [permissionString, employeeId]
      );
      if (inserted["affectedRows"] > 0) {
        return res.json({
          message: "Status Updated",
          status: "success",
        });
      } else {
        return res.json({
          message: "Problem in updating Status!",
          status: "fail",
        });
      }
    } catch (ex) {
      console.log(ex);
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

let updateEmployeeStatus = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var employeeId = req.body.employee_id;
      var status = req.body.status;

      var employeeObj = await server.mc_subdomain.query(
        "SELECT * FROM employee_master WHERE id = ?",
        [employeeId]
      );
      if (employeeObj.length > 0) {
        var updated = await server.mc_subdomain.query(
          "UPDATE employee_master SET status = ? WHERE id = ?",
          [status, employeeId]
        );
        if (updated["affectedRows"] > 0) {
          res.json({
            message: "Status Updated",
            status: "success",
          });
        } else {
          res.json({
            message: "Some problem in updating status!",
            status: "fail",
          });
        }
      } else {
        res.json({
          message: "Employee not found",
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
  } else {
    res.json({
      message: auth,
    });
  }
};

let addEmployee = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var md5 = require("md5");

      var name = req.body.name || null;
      var email = req.body.email || null;
      var password = req.body.password || null;
      var gender = req.body.gender || null;
      var phoneNumber = req.body.phoneNumber || null;
      var profession = req.body.profession || null;
      var permissions = req.body.permissions || [];
      var image = req.body.image || null;
      var joinDate = req.body.join_date;
      var birthDate = req.body.birth_date;
      var designation = req.body.designation;
      var salary = req.body.salary;
      var salaryType = req.body.salary_type;
      var shift = req.body.shift;
      var level = req.body.level || null;
      var days = req.body.days;
      var classType = req.body.class_type || null;
      var classPerWeek = req.body.class_per_week || null;
      var incentive = req.body.incentive || null;
      var salaryMode = req.body.salary_mode;
      var bankName = req.body.bank_name || null;
      var isfcCode = req.body.isfc_code || null;
      var bankAccNo = req.body.bank_acc_no || null;
      var addressStatus = req.body.address_status;
      var currentAddress = req.body.current_address;
      var permanentAddress = req.body.permanent_address || null;
      var status = req.body.status != 1 ? 0 : 1;

      if (name == null || email == null || password == null) {
        return res.json({
          message: "Name, Email & password is Required!",
          status: "fail",
        });
      }
      var employeeObj = await server.mc_subdomain.query(
        "SELECT `email` FROM employee_master WHERE email = ?",
        [email]
      );

      if (employeeObj.length == 0) {
        var photoName = null;

        if (image != null && image != "" && image != "undefined") {
          var path = global.IMG_PATH + "assets/images/user_profile/";
          image = new Buffer.from(image, "base64");

          photoName = moment().format("YYYY-MM-DD-HH-mm-ss") + "user.jpeg";
          await fs.writeFileSync(path + photoName, image);
        }

        var emp_inserted = await server.mc_subdomain.query(
          "INSERT INTO employee_master (user_name,email,password,phone,gender,salary,salary_type,class_type,number_of_class,incentive_salary,join_date,permission,profession_id,department_id,salary_mode,birth_date,home_status,current_address,permanent_address,bank_name,bank_ifsc,bank_acc_no,level_id,days_of_week,shift,status,profile_image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            name,
            email,
            md5(password),
            phoneNumber,
            gender,
            salary,
            salaryType,
            classType,
            classPerWeek,
            incentive,
            joinDate,
            Serialize.serialize(permissions),
            profession,
            designation,
            salaryMode,
            birthDate,
            addressStatus,
            currentAddress,
            permanentAddress,
            bankName,
            isfcCode,
            bankAccNo,
            level,
            Serialize.serialize(days),
            shift,
            status,
            photoName,
          ]
        );

        // var emp_inserted = await server.mc_subdomain.query('INSERT INTO employee_master (user_name,email,password,phone,gender,profession_id,permission,join_date,status) VALUES(?,?,?,?,?,?,?,?,?)',
        // [name,email,md5(password),phoneNumber,gender,profession,Serialize.serialize(permissions),joinDate,status]);

        if (emp_inserted["affectedRows"] > 0) {
          var reg_inserted = await server.mc_superadmin.query(
            "INSERT INTO register_master (user_name,email,register_as,subdomian_name,register_date,connected_to) VALUES(?,?,?,?,?,?)",
            [name, email, "Employee", global.subdomain, dt.format("Y-m-d"), "0"]
          );

          if (reg_inserted["affectedRows"] > 0) {
            res.json({
              message: "Employee Added",
              status: "success",
            });
          } else {
            res.json({
              message: "Problem in adding Employee!",
              status: "fail",
            });
          }
        }
      } else {
        res.json({
          message: "Email is already registered with Simplyloose",
          status: "fail",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        error: e,
        message: "error",
        status: "fail",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

getEmployeeInputFields = async (req, res) => {
  try {
    var server = require("../server");
    let Config = require("../config/constants").getConstants();
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let professionObj = await server.mc_subdomain.query(
      "SELECT * FROM professional_master WHERE status = 1"
    );
    let departmentObj = await server.mc_subdomain.query(
      "SELECT * FROM department_master"
    );
    let levelObj = await server.mc_subdomain.query(
      "SELECT * FROM personal_training_level"
    );
    let shiftObj = await server.mc_subdomain.query("SELECT * FROM shifts");
    let days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thrusday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    let temp = Config["salary_type"];
    let salaryType = [];
    for (let i in temp) salaryType.push(temp[i]);

    let classType = await server.mc_subdomain.query(
      "SELECT * FROM class_category"
    );
    let salaryMode = ["Cash", "Cheque", "Bank"];

    res.json({
      status: "success",
      profession: professionObj,
      designation: departmentObj,
      level: levelObj,
      shift: shiftObj,
      days: days,
      salary_type: salaryType,
      class_type: classType,
      salary_mode: salaryMode,
      message: "Data Found",
    });
  } catch (e) {
    console.log(e);
    res.json({
      error: e,
      message: "error",
      status: "fail",
    });
  }
};

module.exports = {
  getEmployees: getEmployees,
  getEmployeeDetail: getEmployeeDetail,
  updateEmployeeStatus: updateEmployeeStatus,
  updateEmployeesModuleStatus: updateEmployeesModuleStatus,
  addEmployee: addEmployee,
  getEmployeeInputFields: getEmployeeInputFields,
};
