var server = require("../server");
var util = require("util");
var moment = require("moment");

var dateTime = require("node-datetime");
var dt = dateTime.create();

let getClassListMonthWise = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var yogaModuleEnable = await server.mc_subdomain.query(
        "SELECT * FROM installed_module_master WHERE module_name = ? AND status = ? AND expire_date >= ?",
        ["Yoga", 1, dt.format("Y-m-d")]
      );
      var gymModuleEnable = await server.mc_subdomain.query(
        "SELECT * FROM installed_module_master WHERE module_name = ? AND status = ? AND expire_date >= ?",
        ["Gym", 1, dt.format("Y-m-d")]
      );

      var currentDate = dt.format("Y-m-d");
      var eventYogaList = [];
      var eventGymList = [];
      var todayYogaClass = [];
      var todayGymClass = [];
      var currentYogaClasses = [];
      var currentGymClasses = [];

      var currentMonth = dt.format("m");
      var currentYear = dt.format("Y");

      var date = new Date();
      var moment = require("moment");
      var startDate = dt.format("Y-m-01");
      var endDate = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0,
        23,
        59,
        59
      )
        .toISOString()
        .split("T")[0];

      var currentYogaClasses = {};
      var currentGymClasses = {};
      // if(yogaModuleEnable.length > 0)
      //     currentYogaClasses = await server.mc_subdomain.query('SELECT *,DATE_FORMAT(start_date,"%Y-%m-%d") start_date,DATE_FORMAT(end_date,"%Y-%m-%d") end_date FROM class_master WHERE start_date BETWEEN ? AND ? OR end_date BETWEEN ? AND ? OR start_date = ? AND status = ?',[startDate,endDate,startDate,endDate,'0000-00-00',1]);

      if (gymModuleEnable.length > 0) {
        var gymCategoryObj = await server.mc_subdomain.query(
          'SELECT * FROM class_category WHERE category_name LIKE "gym"'
        );
        if (gymCategoryObj.length > 0) {
          currentGymClasses = await server.mc_subdomain.query(
            'SELECT *,DATE_FORMAT(start_date,"%Y-%m-%d") start_date,DATE_FORMAT(end_date,"%Y-%m-%d") end_date FROM membership_class_master WHERE class_category_id = ? AND start_date BETWEEN ? AND ? OR end_date BETWEEN ? AND ? OR start_date = ? AND status = ?',
            [
              gymCategoryObj[0]["id"],
              startDate,
              endDate,
              startDate,
              endDate,
              "0000-00-00",
              1,
            ]
          );
        }

        var yogaCategoryObj = await server.mc_subdomain.query(
          'SELECT * FROM class_category WHERE category_name LIKE "yoga"'
        );
        if (yogaCategoryObj.length > 0) {
          currentYogaClasses = await server.mc_subdomain.query(
            'SELECT *,DATE_FORMAT(start_date,"%Y-%m-%d") start_date,DATE_FORMAT(end_date,"%Y-%m-%d") end_date FROM class_master WHERE class_category_id = ? AND start_date BETWEEN ? AND ? OR end_date BETWEEN ? AND ? OR start_date = ? AND status = ?',
            [
              yogaCategoryObj[0]["id"],
              startDate,
              endDate,
              startDate,
              endDate,
              "0000-00-00",
              1,
            ]
          );
        }
      }

      var end = date.getFullYear() + "-0" + (date.getMonth() + 2) + "-01";
      var a = moment(startDate);
      var b = moment(end);

      var i = 0;
      var j = 0;
      while (b > a) {
        if (currentYogaClasses.length > 0) {
          for (var ind in currentYogaClasses) {
            var days = currentYogaClasses[ind]["days"].split(",");
            var getDay = new Date(a.format("YYYY-MM-DD")).getDay().toString();
            if (days.indexOf(getDay) != -1) {
              if (eventYogaList.indexOf(a.format("YYYY-MM-DD")) == -1) {
                eventYogaList[i] = a.format("YYYY-MM-DD");
                i++;
              }
            }
          }
        }

        if (currentGymClasses.length > 0) {
          for (var ind in currentGymClasses) {
            var days = currentGymClasses[ind]["days"].split(",");
            var getDay = new Date(a.format("YYYY-MM-DD")).getDay().toString();
            if (days.indexOf(getDay) != -1) {
              if (eventGymList.indexOf(a.format("YYYY-MM-DD")) == -1) {
                eventGymList[j] = a.format("YYYY-MM-DD");
                j++;
              }
            }
          }
        }
        a.add(1, "days");
      }

      var eventList = [];
      var _ = require("underscore");
      eventList[0] = _.difference(eventYogaList, eventGymList); // Yoga Class Day List
      eventList[1] = _.difference(eventGymList, eventYogaList); // Gym Class Day List
      eventList[2] = _.intersection(eventGymList, eventYogaList); // Both Class Day List

      /*    var i = 0;
            var j = 0;
            for(var ind in currentYogaClasses)
            {
                var days = currentYogaClasses[ind]['days'].split(',');
                if(days.indexOf(new Date().getDay().toString()) != -1)
                {
                    todayYogaClass[i++] = currentYogaClasses[ind]['title'];
                }
            }

            for(var ind in currentGymClasses)
            {
                var days = currentGymClasses[ind]['days'].split(',');
                if(days.indexOf(new Date().getDay().toString()) != -1)
                {
                    todayGymClass[j++] = currentGymClasses[ind]['title'];
                }
            }*/

      res.json({
        dateList: eventList,
        yogaClassList: todayYogaClass,
        gymClassList: todayGymClass,
        massage: "Data Found",
        status: "success",
      });
    } catch (ex) {
      console.log(ex);
      res.json({
        message: "Something is not right!",
        status: "fail",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

let getClassListDayWise = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var currentDate = dt.format("Y-m-d");
      var todayYogaClass = [];
      var todayGymClass = [];

      var yogaModuleEnable = await server.mc_subdomain.query(
        "SELECT * FROM installed_module_master WHERE module_name = ? AND status = ? AND expire_date >= ?",
        ["Yoga", 1, currentDate]
      );
      var gymModuleEnable = await server.mc_subdomain.query(
        "SELECT * FROM installed_module_master WHERE module_name = ? AND status = ? AND expire_date >= ?",
        ["Gym", 1, currentDate]
      );

      // if(yogaModuleEnable.length > 0)
      // {
      //     var todayYogaClass = await server.mc_subdomain.query('SELECT id,title,description,image,DATE_FORMAT(start_time, "%h:%i %p") as start_time,DATE_FORMAT(end_time, "%h:%i %p") as end_time FROM class_master WHERE days LIKE "%?%" AND start_date <= ? AND end_date >= ? OR start_date = ? AND status = ?',[new Date(currentDate).getDay(),currentDate,currentDate,'0000-00-00',1]);

      //     for(var i in todayYogaClass)
      //     {
      //         var userClassObj = await server.mc_subdomain.query('SELECT *,DATE_FORMAT(start_date, "%Y-%m-%d") as start_date,DATE_FORMAT(end_date, "%Y-%m-%d") as end_date,DATE_FORMAT(create_time, "%Y-%m-%d %h:%i %p") as create_time FROM user_class_master WHERE class_id = ?',[todayYogaClass[i]['id']]);
      //         todayYogaClass[i]['user_class_master'] = userClassObj;

      //         for(var j in userClassObj)
      //         {
      //             var userDetailObj = await server.mc_subdomain.query('SELECT id,user_name,first_name,last_name,email FROM user_master WHERE id = ?',[userClassObj[j]['user_id']]);
      //             userClassObj[j]['user_detail'] = userDetailObj[0];
      //         }
      //     }
      // }

      if (gymModuleEnable.length > 0) {
        var gymCategoryObj = await server.mc_subdomain.query(
          'SELECT * FROM class_category WHERE category_name LIKE "gym"'
        );
        if (gymCategoryObj.length > 0) {
          var todayGymClass = await server.mc_subdomain.query(
            'SELECT id,title,description,image,DATE_FORMAT(start_time, "%h:%i %p") as start_time,DATE_FORMAT(end_time, "%h:%i %p") as end_time FROM membership_class_master WHERE (class_category_id = ? AND days LIKE "%?%" AND start_date <= ? AND end_date >= ?) OR start_date = ? AND status = ?',
            [
              gymCategoryObj[0]["id"],
              new Date(currentDate).getDay(),
              currentDate,
              currentDate,
              "0000-00-00",
              1,
            ]
          );

          for (var i in todayGymClass) {
            var userClassObj = await server.mc_subdomain.query(
              'SELECT *,DATE_FORMAT(start_date, "%Y-%m-%d") as start_date,DATE_FORMAT(end_date, "%Y-%m-%d") as end_date,DATE_FORMAT(create_time, "%Y-%m-%d %h:%i %p") as create_time FROM membership_class_register_master WHERE class_id = ?',
              [todayGymClass[i]["id"]]
            );
            todayGymClass[i]["user_class_master"] = userClassObj;

            for (var j in userClassObj) {
              var userDetailObj = await server.mc_subdomain.query(
                "SELECT id,user_name,first_name,last_name,email FROM user_master WHERE id = ?",
                [userClassObj[j]["user_id"]]
              );
              userClassObj[j]["user_detail"] = userDetailObj[0];
            }
          }
        }

        var yogaCategoryObj = await server.mc_subdomain.query(
          'SELECT * FROM class_category WHERE category_name LIKE "yoga"'
        );
        if (yogaCategoryObj.length > 0) {
          var todayYogaClass = await server.mc_subdomain.query(
            'SELECT id,title,description,image,DATE_FORMAT(start_time, "%h:%i %p") as start_time,DATE_FORMAT(end_time, "%h:%i %p") as end_time FROM membership_class_master WHERE class_category_id = ? AND days LIKE "%?%" AND start_date <= ? AND end_date >= ? OR start_date = ? AND status = ?',
            [
              yogaCategoryObj[0]["id"],
              new Date(currentDate).getDay(),
              currentDate,
              currentDate,
              "0000-00-00",
              1,
            ]
          );

          for (var i in todayYogaClass) {
            var userClassObj = await server.mc_subdomain.query(
              'SELECT *,DATE_FORMAT(start_date, "%Y-%m-%d") as start_date,DATE_FORMAT(end_date, "%Y-%m-%d") as end_date,DATE_FORMAT(create_time, "%Y-%m-%d %h:%i %p") as create_time FROM user_class_master WHERE class_id = ?',
              [todayYogaClass[i]["id"]]
            );
            todayYogaClass[i]["user_class_master"] = userClassObj;

            for (var j in userClassObj) {
              var userDetailObj = await server.mc_subdomain.query(
                "SELECT id,user_name,first_name,last_name,email FROM user_master WHERE id = ?",
                [userClassObj[j]["user_id"]]
              );
              userClassObj[j]["user_detail"] = userDetailObj[0];
            }
          }
        }
      }

      res.json({
        yogaClassList: todayYogaClass,
        gymClassList: todayGymClass,
        yogaModuleEnable: yogaModuleEnable.length > 0 ? true : false,
        gymModuleEnable: gymModuleEnable.length > 0 ? true : false,
        massage: "Data Found",
        status: "success",
      });
    } catch (e) {
      console.log(e);
      res.json({
        message: "Something is not right!",
        status: "fail",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

let getClassDetail = async (req, res) => {
  var auth = await require("./ExpertApiBaseController").AuthoriseRequest(
    req,
    res
  );
  if (auth == "success") {
    try {
      var server = require("../server");
      server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

      var dayList = [];
      var classType = req.query["classType"];
      var classId = req.query["classId"];
      var week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      if (classType == "YOGA" && classId != undefined) {
        var classObj = await server.mc_subdomain.query(
          'SELECT *,DATE_FORMAT(start_date, "%Y-%m-%d") AS start_date,DATE_FORMAT(end_date, "%Y-%m-%d") AS end_date,DATE_FORMAT(start_time, "%h:%i %p") as start_time,DATE_FORMAT(end_time, "%h:%i %p") as end_time FROM class_master WHERE id = ?',
          [classId]
        );

        if (classObj.length > 0) {
          var employeeObj = await server.mc_subdomain.query(
            'SELECT *,DATE_FORMAT(join_date, "%Y-%m-%d") AS join_date,DATE_FORMAT(birth_date, "%Y-%m-%d") AS birth_date FROM employee_master WHERE id = ?',
            [classObj[0]["employee_id"]]
          );
          delete employeeObj[0]["password"];
          classObj[0]["employee_master_multi"] = employeeObj;

          var userClassObj = await server.mc_subdomain.query(
            'SELECT *,DATE_FORMAT(create_time, "%Y-%m-%d %h:%i %p") as create_time FROM user_class_master WHERE class_id = ?',
            [classId]
          );
          classObj[0]["user_class_master"] = userClassObj;

          for (var i in userClassObj) {
            var userDetailObj = await server.mc_subdomain.query(
              'SELECT *,DATE_FORMAT(join_date, "%Y-%m-%d") AS join_date,DATE_FORMAT(birth_date, "%Y-%m-%d") AS birth_date,DATE_FORMAT(expire_date, "%Y-%m-%d") AS expire_date FROM user_master WHERE id = ?',
              [userClassObj[i]["user_id"]]
            );
            userClassObj[i]["user_detail"] = userDetailObj[0];
          }

          var days = classObj[0]["days"];
          var splitted = days.split(",");
          for (var i in splitted) dayList[i] = week[splitted[i]];

          classObj[0]["dayList"] = dayList;

          res.json({
            classDetail: classObj[0],
            massage: "Data Found",
            status: "success",
          });
        } else {
          res.json({
            classDetail: "",
            massage: "No Yoga Class Found",
            status: "fail",
          });
        }
      } else if (classType == "GYM" && classId != undefined) {
        var classObj = await server.mc_subdomain.query(
          'SELECT *,DATE_FORMAT(start_date, "%Y-%m-%d") AS start_date,DATE_FORMAT(end_date, "%Y-%m-%d") AS end_date,DATE_FORMAT(start_time, "%h:%i %p") as start_time,DATE_FORMAT(end_time, "%h:%i %p") as end_time FROM membership_class_master WHERE id = ?',
          [classId]
        );

        if (classObj.length > 0) {
          var userClassObj = await server.mc_subdomain.query(
            'SELECT *,DATE_FORMAT(create_time, "%Y-%m-%d %h:%i %p") as create_time FROM membership_class_register_master WHERE class_id = ?',
            [classId]
          );
          classObj[0]["user_class_master"] = userClassObj;

          var empIds = classObj[0]["employee_id"].split(",");
          var employeeObj = await server.mc_subdomain.query(
            'SELECT *,DATE_FORMAT(join_date, "%Y-%m-%d") AS join_date,DATE_FORMAT(birth_date, "%Y-%m-%d") AS birth_date FROM employee_master WHERE id IN (?)',
            [empIds]
          );
          delete employeeObj[0]["password"];
          classObj[0]["employee_master_multi"] = employeeObj;

          for (var i in userClassObj) {
            var userDetailObj = await server.mc_subdomain.query(
              'SELECT *,DATE_FORMAT(join_date, "%Y-%m-%d") AS join_date,DATE_FORMAT(birth_date, "%Y-%m-%d") AS birth_date,DATE_FORMAT(expire_date, "%Y-%m-%d") AS expire_date FROM user_master WHERE id = ?',
              [userClassObj[i]["user_id"]]
            );
            userClassObj[i]["user_detail"] = userDetailObj[0];
          }

          var days = classObj[0]["days"];
          var splitted = days.split(",");
          for (var i in splitted) dayList[i] = week[splitted[i]];

          classObj[0]["dayList"] = dayList;

          res.json({
            classDetail: classObj[0],
            massage: "Data Found",
            status: "success",
          });
        }
      } else {
        res.json({
          classDetail: "",
          massage: "Data not Found",
          status: "fail",
        });
      }
    } catch (e) {
      console.log(e);
      res.json({
        message: "Something is not right!",
        status: "fail",
      });
    }
  } else {
    res.json({
      message: auth,
    });
  }
};

let addClass = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let title = req.body["title"];
    let desc = req.body["description"];
    let classCategory = req.body["class_category"];
    let employeeId = req.body["employee_id"];
    let proxyEmployee = req.body["proxy_employee"];
    let location = req.body["location"];
    let room = req.body["room"];
    // let price = req.body['price'];
    let availableSpots = req.body["available_spots"];
    let video = req.body["video"] || null;
    let image = req.body["image"] || null;
    let isDaily = req.body["is_daily"];
    let isClassAnytime = req.body["is_class_anytime"];
    let days = req.body["days"];
    let startDate = req.body["start_date"];
    let endDate = req.body["end_date"];
    let startTime = req.body["start_time"];
    let endTime = req.body["end_time"];
    let status = req.body["status"];

    let packageName = req.body["package_name"];
    let packageDurationPeriod = req.body["package_duration_period"];
    let packageSession = req.body["package_session"];
    let packageSessionPrice = req.body["package_session_price"];

    let videoURL = null;
    if (video != null && video != "") {
      if (video.indexOf("yout.be") != -1) {
        let temp = video.split("/");
        if (temp.length > 0)
          videoURL = "https://www.youtube.com/embed/" + temp[3];
        else videoURL = null;
      } else if (video.indexOf("youtube") != -1) {
        let temp = video.split("?v=");
        if (temp.length > 0)
          videoURL = "https://www.youtube.com/embed/" + temp[1];
        else videoURL = null;
      } else videoURL = null;
    }

    let diff = moment(endDate, "Y-MM-DD").diff(
      moment(startDate, "Y-MM-DD"),
      "days"
    );
    if (isDaily == 0 && diff < 7) {
      let a = moment(startDate, "Y-MM-DD");
      let b = moment(endDate, "Y-MM-DD");
      let dateList = [];
      while (a < b) {
        dateList.push(a.format("E"));
        a.add(1, "days");
      }

      let intersect = dateList.filter((value) => days.includes(value));
      if (intersect.length < days.length) {
        return res.json({
          status: "fail",
          message: "Please select appropriate day from date range",
        });
      }
    }

    let employeeObj = await server.mc_subdomain.query(
      "SELECT * FROM employee_master WHERE id = ?",
      [employeeId]
    );
    if (employeeObj.length > 0) {
      let shiftObj = await server.mc_subdomain.query(
        "SELECT * FROM shifts WHERE id = ?",
        [employeeObj[0]["shift"]]
      );
      if (shiftObj.length > 0) {
        let start = moment(
          moment().format("Y-MM-DD") + " " + shiftObj[0]["start_time"],
          "Y-MM-DD HH:mm:ss"
        );
        let end = moment(
          moment().format("Y-MM-DD") + " " + shiftObj[0]["end_time"],
          "Y-MM-DD HH:mm:ss"
        );

        if (isClassAnytime == 1) {
          let photoName = "";
          if (image != null && image != "" && image != "undefined") {
            var path = global.IMG_PATH + "assets/images/expert/video/";
            image = new Buffer.from(image, "base64");

            photoName =
              path + moment().format("YYYY-MM-DD-HH-mm-ss") + "class.png";
            await fs.writeFileSync(photoName, image);
          }

          let inserted = await server.mc_subdomain.query(
            "INSERT INTO class_master (title,class_category,description,is_daily,days,employee_id,proxy_employee,location,image,video_url,room,available_spots,start_date,end_date,start_time,end_time,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              title,
              classCategory,
              desc,
              isDaily,
              days,
              employeeId,
              proxyEmployee,
              location,
              photoName,
              videoURL,
              room,
              availableSpots,
              isDaily == 1 ? "0000-00-00" : startDate,
              isDaily == 1 ? "0000-00-00" : endDate,
              startTime,
              endTime,
              status,
            ]
          );
          var classMasterId = await server.mc_subdomain.query(
            "SELECT LAST_INSERT_ID() AS id"
          );

          for (let i in packageDurationPeriod) {
            inserted = await server.mc_subdomain.query(
              "INSERT INTO class_packages (class_id,package_name,package_duration_period,number_of_sessions,package_price) VALUES (?,?,?,?,?)",
              [
                classMasterId[0]["id"],
                packageName[i],
                packageDurationPeriod[i],
                packageSession[i],
                packageSessionPrice[i],
              ]
            );
          }

          return res.json({
            status: "success",
            message: "Class Added",
          });
        } else {
          if (
            checkIsTimeBetweenWithSame(
              moment(
                moment().format("Y-MM-DD") + " " + startTime,
                "Y-MM-DD HH:mm:ss"
              ),
              [start, end]
            )
          ) {
            let to_add = 0;
            let classObj = await server.mc_subdomain.query(
              "SELECT * FROM membership_class_master WHERE employee_id = ? AND status = 1",
              [employeeId]
            );
            if (classObj.length > 0) {
              for (let i in classObj) {
                if (isDaily == 0) {
                  if (classObj[i]["is_daily"] == 0) {
                    if (
                      checkIsTimeBetweenWithSame(
                        moment(classObj[i]["start_date"], "Y-MM-DD"),
                        [
                          moment(startDate, "Y-MM-DD"),
                          moment(endDate, "Y-MM-DD"),
                        ]
                      ) &&
                      checkIsTimeBetweenWithSame(
                        moment(classObj[i]["end_date"], "Y-MM-DD"),
                        [
                          moment(startDate, "Y-MM-DD"),
                          moment(endDate, "Y-MM-DD"),
                        ]
                      )
                    ) {
                      let checkDays = classObj[i]["days"].split(",");
                      let newDays = days;
                      let repeatDays = checkDays.filter((value) =>
                        newDays.includes(value)
                      );

                      if (repeatDays.length > 0) {
                        let temp_start_time = moment(
                          moment().format("Y-MM-DD") +
                            " " +
                            classObj[i]["start_time"],
                          "Y-MM-DD HH:mm:ss"
                        );
                        let temp_end_time = moment(
                          moment().format("Y-MM-DD") +
                            " " +
                            classObj[i]["end_time"],
                          "Y-MM-DD HH:mm:ss"
                        );

                        let new_start_time = moment(
                          moment().format("Y-MM-DD") + " " + startTime,
                          "Y-MM-DD HH:mm:ss"
                        );
                        let new_end_time = moment(
                          moment().format("Y-MM-DD") + " " + endTime,
                          "Y-MM-DD HH:mm:ss"
                        );

                        if (
                          checkIsTimeBetween(temp_start_time, [
                            new_start_time,
                            new_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          checkIsTimeBetween(temp_end_time, [
                            new_start_time,
                            new_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          checkIsTimeBetween(new_start_time, [
                            temp_start_time,
                            temp_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          checkIsTimeBetween(new_end_time, [
                            temp_start_time,
                            temp_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          temp_start_time == new_start_time &&
                          temp_end_time == new_end_time
                        )
                          to_add = 1;
                      }
                    }
                  } else {
                    let checkDays = classObj[i]["days"].split(",");
                    let newDays = days;
                    let repeatDays = checkDays.filter((value) =>
                      newDays.includes(value)
                    );

                    if (repeatDays.length > 0) {
                      let temp_start_time = moment(
                        moment().format("Y-MM-DD") +
                          " " +
                          classObj[i]["start_time"],
                        "Y-MM-DD HH:mm:ss"
                      );
                      let temp_end_time = moment(
                        moment().format("Y-MM-DD") +
                          " " +
                          classObj[i]["end_time"],
                        "Y-MM-DD HH:mm:ss"
                      );

                      let new_start_time = moment(
                        moment().format("Y-MM-DD") + " " + startTime,
                        "Y-MM-DD HH:mm:ss"
                      );
                      let new_end_time = moment(
                        moment().format("Y-MM-DD") + " " + endTime,
                        "Y-MM-DD HH:mm:ss"
                      );

                      if (
                        checkIsTimeBetween(temp_start_time, [
                          new_start_time,
                          new_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        checkIsTimeBetween(temp_end_time, [
                          new_start_time,
                          new_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        checkIsTimeBetween(new_start_time, [
                          temp_start_time,
                          temp_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        checkIsTimeBetween(new_end_time, [
                          temp_start_time,
                          temp_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        temp_start_time == new_start_time &&
                        temp_end_time == new_end_time
                      )
                        to_add = 1;
                    }
                  }
                } else {
                  let checkDays = classObj[i]["days"].split(",");
                  let newDays = days;
                  let repeatDays = checkDays.filter((value) =>
                    newDays.includes(value)
                  );

                  if (repeatDays.length > 0) {
                    let temp_start_time = moment(
                      moment().format("Y-MM-DD") +
                        " " +
                        classObj[i]["start_time"],
                      "Y-MM-DD HH:mm:ss"
                    );
                    let temp_end_time = moment(
                      moment().format("Y-MM-DD") +
                        " " +
                        classObj[i]["end_time"],
                      "Y-MM-DD HH:mm:ss"
                    );

                    let new_start_time = moment(
                      moment().format("Y-MM-DD") + " " + startTime,
                      "Y-MM-DD HH:mm:ss"
                    );
                    let new_end_time = moment(
                      moment().format("Y-MM-DD") + " " + endTime,
                      "Y-MM-DD HH:mm:ss"
                    );

                    if (
                      checkIsTimeBetween(temp_start_time, [
                        new_start_time,
                        new_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      checkIsTimeBetween(temp_end_time, [
                        new_start_time,
                        new_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      checkIsTimeBetween(new_start_time, [
                        temp_start_time,
                        temp_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      checkIsTimeBetween(new_end_time, [
                        temp_start_time,
                        temp_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      temp_start_time == new_start_time &&
                      temp_end_time == new_end_time
                    )
                      to_add = 1;
                  }
                }
              }
            }

            if (to_add != 0) {
              return res.json({
                status: "fail",
                message: "Employee have time conflict with own classes",
              });
            }

            classObj = await server.mc_subdomain.query(
              "SELECT * FROM membership_class_master WHERE employee_id != ? AND status = 1",
              [employeeId]
            );
            if (classObj.length > 0) {
              for (let i in classObj) {
                if (isDaily == 0) {
                  if (classObj[i]["is_daily"] == 0) {
                    if (
                      checkIsTimeBetweenWithSame(
                        moment(classObj[i]["start_date"], "Y-MM-DD"),
                        [
                          moment(startDate, "Y-MM-DD"),
                          moment(endDate, "Y-MM-DD"),
                        ]
                      ) &&
                      checkIsTimeBetweenWithSame(
                        moment(classObj[i]["end_date"], "Y-MM-DD"),
                        [
                          moment(startDate, "Y-MM-DD"),
                          moment(endDate, "Y-MM-DD"),
                        ]
                      )
                    ) {
                      let checkDays = classObj[i]["days"].split(",");
                      let newDays = days;
                      let repeatDays = checkDays.filter((value) =>
                        newDays.includes(value)
                      );

                      if (repeatDays.length > 0) {
                        let temp_start_time = moment(
                          moment().format("Y-MM-DD") +
                            " " +
                            classObj[i]["start_time"],
                          "Y-MM-DD HH:mm:ss"
                        );
                        let temp_end_time = moment(
                          moment().format("Y-MM-DD") +
                            " " +
                            classObj[i]["end_time"],
                          "Y-MM-DD HH:mm:ss"
                        );

                        let new_start_time = moment(
                          moment().format("Y-MM-DD") + " " + startTime,
                          "Y-MM-DD HH:mm:ss"
                        );
                        let new_end_time = moment(
                          moment().format("Y-MM-DD") + " " + endTime,
                          "Y-MM-DD HH:mm:ss"
                        );

                        if (
                          checkIsTimeBetween(temp_start_time, [
                            new_start_time,
                            new_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          checkIsTimeBetween(temp_end_time, [
                            new_start_time,
                            new_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          checkIsTimeBetween(new_start_time, [
                            temp_start_time,
                            temp_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          checkIsTimeBetween(new_end_time, [
                            temp_start_time,
                            temp_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          temp_start_time == new_start_time &&
                          temp_end_time == new_end_time
                        )
                          to_add = 1;
                      }
                    }
                  } else {
                    let checkDays = classObj[i]["days"].split(",");
                    let newDays = days;
                    let repeatDays = checkDays.filter((value) =>
                      newDays.includes(value)
                    );

                    if (repeatDays.length > 0) {
                      let temp_start_time = moment(
                        moment().format("Y-MM-DD") +
                          " " +
                          classObj[i]["start_time"],
                        "Y-MM-DD HH:mm:ss"
                      );
                      let temp_end_time = moment(
                        moment().format("Y-MM-DD") +
                          " " +
                          classObj[i]["end_time"],
                        "Y-MM-DD HH:mm:ss"
                      );

                      let new_start_time = moment(
                        moment().format("Y-MM-DD") + " " + startTime,
                        "Y-MM-DD HH:mm:ss"
                      );
                      let new_end_time = moment(
                        moment().format("Y-MM-DD") + " " + endTime,
                        "Y-MM-DD HH:mm:ss"
                      );

                      if (
                        checkIsTimeBetween(temp_start_time, [
                          new_start_time,
                          new_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        checkIsTimeBetween(temp_end_time, [
                          new_start_time,
                          new_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        checkIsTimeBetween(new_start_time, [
                          temp_start_time,
                          temp_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        checkIsTimeBetween(new_end_time, [
                          temp_start_time,
                          temp_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        temp_start_time == new_start_time &&
                        temp_end_time == new_end_time
                      )
                        to_add = 1;
                    }
                  }
                } else {
                  let checkDays = classObj[i]["days"].split(",");
                  let newDays = days;
                  let repeatDays = checkDays.filter((value) =>
                    newDays.includes(value)
                  );

                  if (repeatDays.length > 0) {
                    let temp_start_time = moment(
                      moment().format("Y-MM-DD") +
                        " " +
                        classObj[i]["start_time"],
                      "Y-MM-DD HH:mm:ss"
                    );
                    let temp_end_time = moment(
                      moment().format("Y-MM-DD") +
                        " " +
                        classObj[i]["end_time"],
                      "Y-MM-DD HH:mm:ss"
                    );

                    let new_start_time = moment(
                      moment().format("Y-MM-DD") + " " + startTime,
                      "Y-MM-DD HH:mm:ss"
                    );
                    let new_end_time = moment(
                      moment().format("Y-MM-DD") + " " + endTime,
                      "Y-MM-DD HH:mm:ss"
                    );

                    if (
                      checkIsTimeBetween(temp_start_time, [
                        new_start_time,
                        new_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      checkIsTimeBetween(temp_end_time, [
                        new_start_time,
                        new_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      checkIsTimeBetween(new_start_time, [
                        temp_start_time,
                        temp_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      checkIsTimeBetween(new_end_time, [
                        temp_start_time,
                        temp_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      temp_start_time == new_start_time &&
                      temp_end_time == new_end_time
                    )
                      to_add = 1;
                  }
                }

                if (to_add == 1) {
                  if (
                    classObj[i]["room"] != null &&
                    classObj[i]["room"] != ""
                  ) {
                    if (room != null && room != "") {
                      if (
                        classObj[i]["room"].toLowerCase() != room.toLowerCase()
                      ) {
                        to_add = 0;
                      } else if (
                        classObj[i]["room"].toLowerCase() == room.toLowerCase()
                      ) {
                        return res.json({
                          status: "fail",
                          message:
                            "Employee Have A Time Conflict with other classes in Same Room",
                        });
                      }
                    }
                  } else {
                    if (
                      classObj[i]["room"] == null ||
                      classObj[i]["room"] == ""
                    ) {
                      to_add = 0;
                    }
                  }
                }
              }
            }

            if (to_add != 0) {
              return res.json({
                status: "success",
                message: "Employee Have A Time Conflict with other classes",
              });
            }

            if (to_add == 0) {
              let photoName = "";
              if (image != null && image != "" && image != "undefined") {
                var path = global.IMG_PATH + "assets/images/expert/video/";
                image = new Buffer.from(image, "base64");

                photoName =
                  path + moment().format("YYYY-MM-DD-HH-mm-ss") + "class.png";
                await fs.writeFileSync(photoName, image);
              }

              let inserted = await server.mc_subdomain.query(
                "INSERT INTO class_master (title,class_category,description,is_daily,days,employee_id,proxy_employee,location,image,video_url,room,available_spots,start_date,end_date,start_time,end_time,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                [
                  title,
                  classCategory,
                  desc,
                  isDaily,
                  days,
                  employeeId,
                  proxyEmployee,
                  location,
                  photoName,
                  videoURL,
                  room,
                  availableSpots,
                  isDaily == 1 ? "0000-00-00" : startDate,
                  isDaily == 1 ? "0000-00-00" : endDate,
                  startTime,
                  endTime,
                  status,
                ]
              );
              var classMasterId = await server.mc_subdomain.query(
                "SELECT LAST_INSERT_ID() AS id"
              );

              for (let i in packageDurationPeriod) {
                inserted = await server.mc_subdomain.query(
                  "INSERT INTO class_packages (class_id,package_name,package_duration_period,number_of_sessions,package_price) VALUES (?,?,?,?,?)",
                  [
                    classMasterId[0]["id"],
                    packageName[i],
                    packageDurationPeriod[i],
                    packageSession[i],
                    packageSessionPrice[i],
                  ]
                );
              }

              res.json({
                status: "success",
                message: "Class Created",
              });
            }
          } else {
            res.json({
              status: "fail",
              message: "Class not inside employee shift",
            });
          }
        }
      } else {
        res.json({
          status: "fail",
          message: "No Employee shift define",
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let checkIsTimeBetween = async ($check_time = "", $check_with = []) => {
  return $check_time > $check_with[0] && $check_time < $check_with[1];
};

let checkIsTimeBetweenWithSame = async ($check_time = "", $check_with = []) => {
  return $check_time >= $check_with[0] && $check_time <= $check_with[1];
};

let updateClass = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];
    let title = req.body["title"];
    let desc = req.body["description"];
    let classCategory = req.body["class_category"];
    let employeeId = req.body["employee_id"];
    let proxyEmployee = req.body["proxy_employee"];
    let location = req.body["location"];
    let room = req.body["room"];
    // let price = req.body['price'];
    let availableSpots = req.body["available_spots"];
    let video = req.body["video"] || null;
    let image = req.body["image"] || null;
    let isDaily = req.body["is_daily"];
    let isClassAnytime = req.body["is_class_anytime"];
    let days = req.body["days"];
    let startDate = req.body["start_date"];
    let endDate = req.body["end_date"];
    let startTime = req.body["start_time"];
    let endTime = req.body["end_time"];
    let status = req.body["status"];

    let packageName = req.body["package_name"];
    let packageDurationPeriod = req.body["package_duration_period"];
    let packageSession = req.body["package_session"];
    let packageSessionPrice = req.body["package_session_price"];

    let videoURL = null;
    if (video != null && video != "") {
      if (video.indexOf("yout.be") != -1) {
        let temp = video.split("/");
        if (temp.length > 0)
          videoURL = "https://www.youtube.com/embed/" + temp[3];
        else videoURL = null;
      } else if (video.indexOf("youtube") != -1) {
        let temp = video.split("?v=");
        if (temp.length > 0)
          videoURL = "https://www.youtube.com/embed/" + temp[1];
        else videoURL = null;
      } else videoURL = null;
    }

    let diff = moment(endDate, "Y-MM-DD").diff(
      moment(startDate, "Y-MM-DD"),
      "days"
    );
    if (isDaily == 0 && diff < 7) {
      let a = moment(startDate, "Y-MM-DD");
      let b = moment(endDate, "Y-MM-DD");
      let dateList = [];
      while (a < b) {
        dateList.push(a.format("E"));
        a.add(1, "days");
      }

      let intersect = dateList.filter((value) => days.includes(value));
      if (intersect.length < days.length) {
        return res.json({
          status: "fail",
          message: "Please select appropriate day from date range",
        });
      }
    }

    let employeeObj = await server.mc_subdomain.query(
      "SELECT * FROM employee_master WHERE id = ?",
      [employeeId]
    );
    if (employeeObj.length > 0) {
      let shiftObj = await server.mc_subdomain.query(
        "SELECT * FROM shifts WHERE id = ?",
        [employeeObj[0]["shift"]]
      );
      if (shiftObj.length > 0) {
        let start = moment(
          moment().format("Y-MM-DD") + " " + shiftObj[0]["start_time"],
          "Y-MM-DD HH:mm:ss"
        );
        let end = moment(
          moment().format("Y-MM-DD") + " " + shiftObj[0]["end_time"],
          "Y-MM-DD HH:mm:ss"
        );

        if (isClassAnytime == 1) {
          let photoName = "";
          if (image != null && image != "" && image != "undefined") {
            var path = global.IMG_PATH + "assets/images/expert/video/";

            let checkpObj = await server.mc_subdomain.query(
              "SELECT * FROM membership_class_master WHERE id = ?",
              [id]
            );
            if (checkObj[0]["image"] != null && checkObj[0]["image"] != "") {
              fs.unlink = util.promisify(fs.unlink);
              fs.unlink(
                global.IMG_PATH +
                  "assets/images/expert/video/" +
                  checkObj[0]["image"]
              );
            }

            image = new Buffer.from(image, "base64");

            photoName =
              path + moment().format("YYYY-MM-DD-HH-mm-ss") + "class.png";
            await fs.writeFileSync(photoName, image);
          }

          let updated = await server.mc_subdomain.query(
            "UPDATE membership_class_master SET title = ?,class_category = ?,description = ?,is_daily = ?,days = ?,employee_id = ?,proxy_employee = ?,location = ?,image = ?,video_url = ?,room = ?,available_spots = ?,start_date = ?,end_date = ?,start_time = ?,end_time = ?,status = ? WHERE id = ?",
            [
              title,
              classCategory,
              desc,
              isDaily,
              days,
              employeeId,
              proxyEmployee,
              location,
              photoName,
              videoURL,
              room,
              availableSpots,
              isDaily == 1 ? "0000-00-00" : startDate,
              isDaily == 1 ? "0000-00-00" : endDate,
              startTime,
              endTime,
              status,
              id,
            ]
          );
          var classMasterId = await server.mc_subdomain.query(
            "SELECT LAST_INSERT_ID() AS id"
          );

          let packageObj = await server.mc_subdomain.query(
            "SELECT * FROM class_packages WHERE class_id = ?",
            [id]
          );
          for (let i in packageObj) {
            inserted = await server.mc_subdomain.query(
              "UPDATE class_packages SET class_id = ?, = ?,package_duration_period = ?,number_of_sessions = ?,package_price = ? WHERE id = ?",
              [
                classMasterId[0]["id"],
                packageName[i],
                packageDurationPeriod[i],
                packageSession[i],
                packageSessionPrice[i],
                packageObj[i]["id"],
              ]
            );
          }

          return res.json({
            status: "success",
            message: "Class Added",
          });
        } else {
          if (
            checkIsTimeBetweenWithSame(
              moment(
                moment().format("Y-MM-DD") + " " + startTime,
                "Y-MM-DD HH:mm:ss"
              ),
              [start, end]
            )
          ) {
            let to_add = 0;
            let classObj = await server.mc_subdomain.query(
              "SELECT * FROM membership_class_master WHERE employee_id = ? AND status = 1",
              [employeeId]
            );
            if (classObj.length > 0) {
              for (let i in classObj) {
                if (isDaily == 0) {
                  if (classObj[i]["is_daily"] == 0) {
                    if (
                      checkIsTimeBetweenWithSame(
                        moment(classObj[i]["start_date"], "Y-MM-DD"),
                        [
                          moment(startDate, "Y-MM-DD"),
                          moment(endDate, "Y-MM-DD"),
                        ]
                      ) &&
                      checkIsTimeBetweenWithSame(
                        moment(classObj[i]["end_date"], "Y-MM-DD"),
                        [
                          moment(startDate, "Y-MM-DD"),
                          moment(endDate, "Y-MM-DD"),
                        ]
                      )
                    ) {
                      let checkDays = classObj[i]["days"].split(",");
                      let newDays = days;
                      let repeatDays = checkDays.filter((value) =>
                        newDays.includes(value)
                      );

                      if (repeatDays.length > 0) {
                        let temp_start_time = moment(
                          moment().format("Y-MM-DD") +
                            " " +
                            classObj[i]["start_time"],
                          "Y-MM-DD HH:mm:ss"
                        );
                        let temp_end_time = moment(
                          moment().format("Y-MM-DD") +
                            " " +
                            classObj[i]["end_time"],
                          "Y-MM-DD HH:mm:ss"
                        );

                        let new_start_time = moment(
                          moment().format("Y-MM-DD") + " " + startTime,
                          "Y-MM-DD HH:mm:ss"
                        );
                        let new_end_time = moment(
                          moment().format("Y-MM-DD") + " " + endTime,
                          "Y-MM-DD HH:mm:ss"
                        );

                        if (
                          checkIsTimeBetween(temp_start_time, [
                            new_start_time,
                            new_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          checkIsTimeBetween(temp_end_time, [
                            new_start_time,
                            new_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          checkIsTimeBetween(new_start_time, [
                            temp_start_time,
                            temp_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          checkIsTimeBetween(new_end_time, [
                            temp_start_time,
                            temp_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          temp_start_time == new_start_time &&
                          temp_end_time == new_end_time
                        )
                          to_add = 1;
                      }
                    }
                  } else {
                    let checkDays = classObj[i]["days"].split(",");
                    let newDays = days;
                    let repeatDays = checkDays.filter((value) =>
                      newDays.includes(value)
                    );

                    if (repeatDays.length > 0) {
                      let temp_start_time = moment(
                        moment().format("Y-MM-DD") +
                          " " +
                          classObj[i]["start_time"],
                        "Y-MM-DD HH:mm:ss"
                      );
                      let temp_end_time = moment(
                        moment().format("Y-MM-DD") +
                          " " +
                          classObj[i]["end_time"],
                        "Y-MM-DD HH:mm:ss"
                      );

                      let new_start_time = moment(
                        moment().format("Y-MM-DD") + " " + startTime,
                        "Y-MM-DD HH:mm:ss"
                      );
                      let new_end_time = moment(
                        moment().format("Y-MM-DD") + " " + endTime,
                        "Y-MM-DD HH:mm:ss"
                      );

                      if (
                        checkIsTimeBetween(temp_start_time, [
                          new_start_time,
                          new_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        checkIsTimeBetween(temp_end_time, [
                          new_start_time,
                          new_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        checkIsTimeBetween(new_start_time, [
                          temp_start_time,
                          temp_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        checkIsTimeBetween(new_end_time, [
                          temp_start_time,
                          temp_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        temp_start_time == new_start_time &&
                        temp_end_time == new_end_time
                      )
                        to_add = 1;
                    }
                  }
                } else {
                  let checkDays = classObj[i]["days"].split(",");
                  let newDays = days;
                  let repeatDays = checkDays.filter((value) =>
                    newDays.includes(value)
                  );

                  if (repeatDays.length > 0) {
                    let temp_start_time = moment(
                      moment().format("Y-MM-DD") +
                        " " +
                        classObj[i]["start_time"],
                      "Y-MM-DD HH:mm:ss"
                    );
                    let temp_end_time = moment(
                      moment().format("Y-MM-DD") +
                        " " +
                        classObj[i]["end_time"],
                      "Y-MM-DD HH:mm:ss"
                    );

                    let new_start_time = moment(
                      moment().format("Y-MM-DD") + " " + startTime,
                      "Y-MM-DD HH:mm:ss"
                    );
                    let new_end_time = moment(
                      moment().format("Y-MM-DD") + " " + endTime,
                      "Y-MM-DD HH:mm:ss"
                    );

                    if (
                      checkIsTimeBetween(temp_start_time, [
                        new_start_time,
                        new_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      checkIsTimeBetween(temp_end_time, [
                        new_start_time,
                        new_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      checkIsTimeBetween(new_start_time, [
                        temp_start_time,
                        temp_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      checkIsTimeBetween(new_end_time, [
                        temp_start_time,
                        temp_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      temp_start_time == new_start_time &&
                      temp_end_time == new_end_time
                    )
                      to_add = 1;
                  }
                }
              }
            }

            if (to_add != 0) {
              return res.json({
                status: "fail",
                message: "Employee have time conflict with own classes",
              });
            }

            classObj = await server.mc_subdomain.query(
              "SELECT * FROM membership_class_master WHERE employee_id != ? AND status = 1",
              [employeeId]
            );
            if (classObj.length > 0) {
              for (let i in classObj) {
                if (isDaily == 0) {
                  if (classObj[i]["is_daily"] == 0) {
                    if (
                      checkIsTimeBetweenWithSame(
                        moment(classObj[i]["start_date"], "Y-MM-DD"),
                        [
                          moment(startDate, "Y-MM-DD"),
                          moment(endDate, "Y-MM-DD"),
                        ]
                      ) &&
                      checkIsTimeBetweenWithSame(
                        moment(classObj[i]["end_date"], "Y-MM-DD"),
                        [
                          moment(startDate, "Y-MM-DD"),
                          moment(endDate, "Y-MM-DD"),
                        ]
                      )
                    ) {
                      let checkDays = classObj[i]["days"].split(",");
                      let newDays = days;
                      let repeatDays = checkDays.filter((value) =>
                        newDays.includes(value)
                      );

                      if (repeatDays.length > 0) {
                        let temp_start_time = moment(
                          moment().format("Y-MM-DD") +
                            " " +
                            classObj[i]["start_time"],
                          "Y-MM-DD HH:mm:ss"
                        );
                        let temp_end_time = moment(
                          moment().format("Y-MM-DD") +
                            " " +
                            classObj[i]["end_time"],
                          "Y-MM-DD HH:mm:ss"
                        );

                        let new_start_time = moment(
                          moment().format("Y-MM-DD") + " " + startTime,
                          "Y-MM-DD HH:mm:ss"
                        );
                        let new_end_time = moment(
                          moment().format("Y-MM-DD") + " " + endTime,
                          "Y-MM-DD HH:mm:ss"
                        );

                        if (
                          checkIsTimeBetween(temp_start_time, [
                            new_start_time,
                            new_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          checkIsTimeBetween(temp_end_time, [
                            new_start_time,
                            new_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          checkIsTimeBetween(new_start_time, [
                            temp_start_time,
                            temp_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          checkIsTimeBetween(new_end_time, [
                            temp_start_time,
                            temp_end_time,
                          ])
                        )
                          to_add = 1;

                        if (
                          temp_start_time == new_start_time &&
                          temp_end_time == new_end_time
                        )
                          to_add = 1;
                      }
                    }
                  } else {
                    let checkDays = classObj[i]["days"].split(",");
                    let newDays = days;
                    let repeatDays = checkDays.filter((value) =>
                      newDays.includes(value)
                    );

                    if (repeatDays.length > 0) {
                      let temp_start_time = moment(
                        moment().format("Y-MM-DD") +
                          " " +
                          classObj[i]["start_time"],
                        "Y-MM-DD HH:mm:ss"
                      );
                      let temp_end_time = moment(
                        moment().format("Y-MM-DD") +
                          " " +
                          classObj[i]["end_time"],
                        "Y-MM-DD HH:mm:ss"
                      );

                      let new_start_time = moment(
                        moment().format("Y-MM-DD") + " " + startTime,
                        "Y-MM-DD HH:mm:ss"
                      );
                      let new_end_time = moment(
                        moment().format("Y-MM-DD") + " " + endTime,
                        "Y-MM-DD HH:mm:ss"
                      );

                      if (
                        checkIsTimeBetween(temp_start_time, [
                          new_start_time,
                          new_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        checkIsTimeBetween(temp_end_time, [
                          new_start_time,
                          new_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        checkIsTimeBetween(new_start_time, [
                          temp_start_time,
                          temp_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        checkIsTimeBetween(new_end_time, [
                          temp_start_time,
                          temp_end_time,
                        ])
                      )
                        to_add = 1;

                      if (
                        temp_start_time == new_start_time &&
                        temp_end_time == new_end_time
                      )
                        to_add = 1;
                    }
                  }
                } else {
                  let checkDays = classObj[i]["days"].split(",");
                  let newDays = days;
                  let repeatDays = checkDays.filter((value) =>
                    newDays.includes(value)
                  );

                  if (repeatDays.length > 0) {
                    let temp_start_time = moment(
                      moment().format("Y-MM-DD") +
                        " " +
                        classObj[i]["start_time"],
                      "Y-MM-DD HH:mm:ss"
                    );
                    let temp_end_time = moment(
                      moment().format("Y-MM-DD") +
                        " " +
                        classObj[i]["end_time"],
                      "Y-MM-DD HH:mm:ss"
                    );

                    let new_start_time = moment(
                      moment().format("Y-MM-DD") + " " + startTime,
                      "Y-MM-DD HH:mm:ss"
                    );
                    let new_end_time = moment(
                      moment().format("Y-MM-DD") + " " + endTime,
                      "Y-MM-DD HH:mm:ss"
                    );

                    if (
                      checkIsTimeBetween(temp_start_time, [
                        new_start_time,
                        new_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      checkIsTimeBetween(temp_end_time, [
                        new_start_time,
                        new_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      checkIsTimeBetween(new_start_time, [
                        temp_start_time,
                        temp_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      checkIsTimeBetween(new_end_time, [
                        temp_start_time,
                        temp_end_time,
                      ])
                    )
                      to_add = 1;

                    if (
                      temp_start_time == new_start_time &&
                      temp_end_time == new_end_time
                    )
                      to_add = 1;
                  }
                }

                if (to_add == 1) {
                  if (
                    classObj[i]["room"] != null &&
                    classObj[i]["room"] != ""
                  ) {
                    if (room != null && room != "") {
                      if (
                        classObj[i]["room"].toLowerCase() != room.toLowerCase()
                      ) {
                        to_add = 0;
                      } else if (
                        classObj[i]["room"].toLowerCase() == room.toLowerCase()
                      ) {
                        return res.json({
                          status: "fail",
                          message:
                            "Employee Have A Time Conflict with other classes in Same Room",
                        });
                      }
                    }
                  } else {
                    if (
                      classObj[i]["room"] == null ||
                      classObj[i]["room"] == ""
                    ) {
                      to_add = 0;
                    }
                  }
                }
              }
            }

            if (to_add != 0) {
              return res.json({
                status: "success",
                message: "Employee Have A Time Conflict with other classes",
              });
            }

            if (to_add == 0) {
              let photoName = "";
              if (image != null && image != "" && image != "undefined") {
                var path = global.IMG_PATH + "assets/images/expert/video/";

                let checkpObj = await server.mc_subdomain.query(
                  "SELECT * FROM membership_class_master WHERE id = ?",
                  [id]
                );
                if (
                  checkObj[0]["image"] != null &&
                  checkObj[0]["image"] != ""
                ) {
                  fs.unlink = util.promisify(fs.unlink);
                  fs.unlink(
                    global.IMG_PATH +
                      "assets/images/expert/video/" +
                      checkObj[0]["image"]
                  );
                }

                image = new Buffer.from(image, "base64");

                photoName =
                  path + moment().format("YYYY-MM-DD-HH-mm-ss") + "class.png";
                await fs.writeFileSync(photoName, image);
              }

              let updated = await server.mc_subdomain.query(
                "UPDATE membership_class_master SET title = ?,class_category = ?,description = ?,is_daily = ?,days = ?,employee_id = ?,proxy_employee = ?,location = ?,image = ?,video_url = ?,room = ?,available_spots = ?,start_date = ?,end_date = ?,start_time = ?,end_time = ?,status = ? WHERE id = ?",
                [
                  title,
                  classCategory,
                  desc,
                  isDaily,
                  days,
                  employeeId,
                  proxyEmployee,
                  location,
                  photoName,
                  videoURL,
                  room,
                  availableSpots,
                  isDaily == 1 ? "0000-00-00" : startDate,
                  isDaily == 1 ? "0000-00-00" : endDate,
                  startTime,
                  endTime,
                  status,
                  id,
                ]
              );
              var classMasterId = await server.mc_subdomain.query(
                "SELECT LAST_INSERT_ID() AS id"
              );

              let packageObj = await server.mc_subdomain.query(
                "SELECT * FROM class_packages WHERE class_id = ?",
                [id]
              );
              for (let i in packageObj) {
                inserted = await server.mc_subdomain.query(
                  "UPDATE class_packages SET class_id = ?, = ?,package_duration_period = ?,number_of_sessions = ?,package_price = ? WHERE id = ?",
                  [
                    classMasterId[0]["id"],
                    packageName[i],
                    packageDurationPeriod[i],
                    packageSession[i],
                    packageSessionPrice[i],
                    packageObj[i]["id"],
                  ]
                );
              }

              res.json({
                status: "success",
                message: "Class Created",
              });
            }
          } else {
            res.json({
              status: "fail",
              message: "Class not inside employee shift",
            });
          }
        }
      } else {
        res.json({
          status: "fail",
          message: "No Employee shift define",
        });
      }
    }
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let deleteClass = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];

    let checkObj = await server.mc_subdomain.query(
      "SELECT * FROM class_master WHERE id = ?",
      [id]
    );
    if (checkObj[0]["image"] != null && checkObj[0]["image"] != "") {
      var path = global.IMG_PATH + "assets/images/expert/video/";
      fs.unlink = util.promisify(fs.unlink);
      fs.unlink(path + checkObj[0]["image"]);
    }

    let deleted = await server.mc_subdomain.query(
      "DELETE FROM class_packages WHERE class_id = ?",
      [checkObj[0]["id"]]
    );
    deleted = await server.mc_subdomain.query(
      "DELETE FROM class_master WHERE id = ?",
      [id]
    );

    res.json({
      status: "success",
      message: "Class Deleted",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let rescheduleClass = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let classId = req.body["class_id"];
    let title = req.body["title"];
    let oldDate = req.body["old_date"];
    let oldStartTime = req.body["old_start_date"];
    let oldEndTime = req.body["old_end_date"];
    let newDate = req.body["new_date"];
    let newStartDate = req.body["new_start_date"];
    let newEndDate = req.body["new_end_date"];
    let day = moment(newDate, "Y-MM-DD").format("E");

    let classObj = await server.mc_subdomain.query(
      "SELECT * membership_class_master WHERE id = ?",
      [classId]
    );
    let employeeObj = await server.mc_subdomain.query(
      "SELECT * FROM employee_master WHERE id = ?",
      [classObj[0]["employee_id"]]
    );
    let shiftObj = await server.mc_subdomain.query(
      "SELECT * FROM shifts WHERE id = ?",
      [employeeObj[0]["shift"]]
    );
    if (shiftObj.length > 0) {
      let start = moment(
        moment().format("Y-MM-DD") + " " + shiftObj[0]["start_time"],
        "Y-MM-DD HH:mm:ss"
      );
      let end = moment(
        moment().format("Y-MM-DD") + " " + shiftObj[0]["end_time"],
        "Y-MM-DD HH:mm:ss"
      );

      let to_add = 0;
      if (
        checkIsTimeBetweenWithSame(
          moment(
            moment().format("Y-MM-DD") + " " + newStartTime,
            "Y-MM-DD HH:mm:ss"
          ),
          [start, end]
        )
      ) {
        let classObj = await server.mc_subdomain.query(
          "SELECT * FROM membership_class_master WHERE employee_id = ? AND status = 1 AND days LIKE ?",
          [employeeId, "%" + day + "%"]
        );
        if (classObj.length > 0) {
          for (let i in classObj) {
            let temp_start_time = moment(
              moment().format("Y-MM-DD") + " " + classObj[i]["start_time"],
              "Y-MM-DD HH:mm:ss"
            );
            let temp_end_time = moment(
              moment().format("Y-MM-DD") + " " + classObj[i]["end_time"],
              "Y-MM-DD HH:mm:ss"
            );

            let new_start_time = moment(
              moment().format("Y-MM-DD") + " " + startTime,
              "Y-MM-DD HH:mm:ss"
            );
            let new_end_time = moment(
              moment().format("Y-MM-DD") + " " + endTime,
              "Y-MM-DD HH:mm:ss"
            );

            if (
              checkIsTimeBetween(temp_start_time, [
                new_start_time,
                new_end_time,
              ])
            )
              to_add = 1;

            if (
              checkIsTimeBetween(temp_end_time, [new_start_time, new_end_time])
            )
              to_add = 1;

            if (
              checkIsTimeBetween(new_start_time, [
                temp_start_time,
                temp_end_time,
              ])
            )
              to_add = 1;

            if (
              checkIsTimeBetween(new_end_time, [temp_start_time, temp_end_time])
            )
              to_add = 1;

            if (
              temp_start_time == new_start_time &&
              temp_end_time == new_end_time
            )
              to_add = 1;
          }
        }

        if (to_add != 0) {
          return res.json({
            status: "fail",
            message: "Employee have time conflict with own classes",
          });
        }

        classObj = await server.mc_subdomain.query(
          "SELECT * FROM membership_class_master WHERE employee_id = ? AND status = 1 AND days LIKE ?",
          [employeeId, "%" + day + "%"]
        );
        if (classObj.length > 0) {
          for (let i in classObj) {
            let temp_start_time = moment(
              moment().format("Y-MM-DD") + " " + classObj[i]["start_time"],
              "Y-MM-DD HH:mm:ss"
            );
            let temp_end_time = moment(
              moment().format("Y-MM-DD") + " " + classObj[i]["end_time"],
              "Y-MM-DD HH:mm:ss"
            );

            let new_start_time = moment(
              moment().format("Y-MM-DD") + " " + startTime,
              "Y-MM-DD HH:mm:ss"
            );
            let new_end_time = moment(
              moment().format("Y-MM-DD") + " " + endTime,
              "Y-MM-DD HH:mm:ss"
            );

            if (
              checkIsTimeBetween(temp_start_time, [
                new_start_time,
                new_end_time,
              ])
            )
              to_add = 1;

            if (
              checkIsTimeBetween(temp_end_time, [new_start_time, new_end_time])
            )
              to_add = 1;

            if (
              checkIsTimeBetween(new_start_time, [
                temp_start_time,
                temp_end_time,
              ])
            )
              to_add = 1;

            if (
              checkIsTimeBetween(new_end_time, [temp_start_time, temp_end_time])
            )
              to_add = 1;

            if (
              temp_start_time == new_start_time &&
              temp_end_time == new_end_time
            )
              to_add = 1;

            if (to_add == 1) {
              if (classObj[i]["room"] != null && classObj[i]["room"] != "") {
                if (room != null && room != "") {
                  if (classObj[i]["room"].toLowerCase() != room.toLowerCase()) {
                    to_add = 0;
                  } else if (
                    classObj[i]["room"].toLowerCase() == room.toLowerCase()
                  ) {
                    return res.json({
                      status: "fail",
                      message:
                        "Employee Have A Time Conflict with other classes in Same Room",
                    });
                  }
                }
              } else {
                if (classObj[i]["room"] == null || classObj[i]["room"] == "") {
                  to_add = 0;
                }
              }
            }
          }
        }

        if (to_add != 0) {
          return res.json({
            status: "success",
            message: "Employee Have A Time Conflict with other classes",
          });
        }

        let rescheduleObj = await server.mc_subdomain.query(
          "SELECT * FROM reschedule_classes WHERE new_date = ?",
          [newDate]
        );
        if (rescheduleObj.length > 0) {
          for (let i in rescheduleObj) {
            let temp_start_time = moment(
              moment().format("Y-MM-DD") +
                " " +
                rescheduleObj[i]["new_start_time"],
              "Y-MM-DD HH:mm:ss"
            );
            let temp_end_time = moment(
              moment().format("Y-MM-DD") +
                " " +
                rescheduleObj[i]["new_end_time"],
              "Y-MM-DD HH:mm:ss"
            );

            let new_start_time = moment(
              moment().format("Y-MM-DD") + " " + newStartTime,
              "Y-MM-DD HH:mm:ss"
            );
            let new_end_time = moment(
              moment().format("Y-MM-DD") + " " + newEndTime,
              "Y-MM-DD HH:mm:ss"
            );

            if (
              checkIsTimeBetween(temp_start_time, [
                new_start_time,
                new_end_time,
              ])
            )
              to_add = 1;

            if (
              checkIsTimeBetween(temp_end_time, [new_start_time, new_end_time])
            )
              to_add = 1;

            if (
              checkIsTimeBetween(new_start_time, [
                temp_start_time,
                temp_end_time,
              ])
            )
              to_add = 1;

            if (
              checkIsTimeBetween(new_end_time, [temp_start_time, temp_end_time])
            )
              to_add = 1;

            if (
              temp_start_time == new_start_time &&
              temp_end_time == new_end_time
            )
              to_add = 1;
          }
        }

        if (to_add != 0) {
          return res.json({
            status: "fail",
            message:
              "Another Class Has Already been Scheduled To " +
              moment(newDate, "Y-MM-DD").format("DD MMM Y") +
              " between " +
              moment(newStartTime, "HH:mm:ss").format("hh:mm A") +
              " and " +
              moment(newEndTime, "HH:mm:ss").format("hh:mm A"),
          });
        }

        if (to_add == 0) {
          let inserted = await server.mc_subdomain.query(
            "INSERT INTO reschedule_classes (class_id,old_date,old_start_time,old_end_time,new_date,new_start_time,new_end_time) VALUES (?,?,?,?,?,?,?)",
            [
              classId,
              oldDate,
              oldStartTime,
              oldEndTime,
              newDate,
              newStartDate,
              newEndDate,
            ]
          );

          let membershipObj = await server.mc_subdomain.query(
            "SELECT t3.phone FROM membership_registration t1, pos_detail t2, user_master t3 WHERE t1.pos_detail_id = t2.id AND t1.user_id = t3.id AND t2.class_id = ? AND t1.end_date >= ? AND start_date <= = ?",
            [
              classId,
              moment().format("Y-MM-DD"),
              moment(newDate, "Y-MM-DD").format("Y-MM-DD"),
            ]
          );

          let phones = [];
          for (let i in membershipObj) {
            phones.push(membershipObj[i]["phone"]);
          }

          let message =
            "Your Class " +
            title +
            " is rescheduled to " +
            moment(newDate, "Y-MM-DD").format("DD MMM Y") +
            " at " +
            moment(newStartTime, "HH:mm:ss").format("hh:mm A");

          //SEND SMS

          res.json({
            status: "success",
            message: "Class Rescheduled",
          });
        }
      } else {
        res.json({
          status: "fail",
          message: "Class not inside employee shift",
        });
      }
    } else {
      res.json({
        status: "fail",
        message: "No Employee shift defined",
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

let classDetail = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];

    let userObj = await server.mc_subdomain.query(
      "SELECT id,user_name,employee_id FROM user_master WHERE status = 1"
    );
    let classObj = await server.mc_subdomain.query(
      "SELECT * FROM membership_class_master WHERE id = ?",
      [id]
    );

    let employeeList = [];
    let employeeObj = await server.mc_subdomain.query(
      "SELECT * FROM employee_master WHERE id IN (?) AND status = 1",
      [classObj[0]["employee_id"]]
    );
    for (let i in employeeObj) {
      employeeList.push(employeeObj[i]["user_name"]);
    }

    let proxyTrainer = null;
    if (
      classObj[0]["proxy_employee"] != null &&
      classObj[0]["proxy_employee"] != ""
    ) {
      let proxyObj = await server.mc_subdomain.query(
        "SELECT * FROM employee_master WHERE id = ?",
        [classObj[0]["proxy_employee"]]
      );
      proxyTrainer = proxyObj[0]["user_name"];
    }

    let dayList = [];
    let weekDaysObj = await server.mc_subdomain.query(
      "SELECT * FROM week_days WHERE id IN (?)",
      [classObj[0]["days"]]
    );
    for (let i in weekDaysObj) {
      dayList.push(weekDaysObj[i]["day"]);
    }

    let participantObj = await server.mc_subdomain.query(
      "SELECT t1.*,t4.user_name FROM membership_registration t1,pos_detail t2,pos_master t3,user_master t4 WHERE t1.pos_detail_id = t2.id AND t2.pos_id = t3.id AND t3.user_id = t4.id AND t2.class_id = ?",
      [id]
    );
    let packageObj = await server.mc_subdomain.query(
      "SELECT * FROM class_packages WHERE class_id = ?",
      [id]
    );

    let userArray = [];
    let n = 0;
    for (let i in userObj) {
      for (let j in participantObj) {
        if (participantObj[j]["user_id"] == userObj[i]["id"]) {
          userArray[n]["id"] = participantObj[j]["id"];
          userArray[n]["user_id"] = userObj[i]["id"];
          userArray[n]["user_name"] = userObj[i]["user_name"];
          userArray[n]["class_id"] = participantObj[j]["class_id"];
          userArray[n]["start_date"] = participantObj[j]["start_date"];
          userArray[n]["end_date"] = participantObj[j]["end_date"];
          userArray[n]["payment_paypal_id"] =
            participantObj[j]["payment_paypal_id"];
          userArray[n]["intent"] = participantObj[j]["intent"];
          userArray[n]["state"] = participantObj[j]["state"];
          userArray[n]["create_time"] = participantObj[j]["create_time"];
          userArray[n]["status"] = participantObj[j]["status"];
          n++;
        }
      }
    }

    res.json({
      status: "success",
      class_obj: classObj,
      employee_list: employeeList,
      day_list: dayList,
      proxy_trainer: proxyTrainer,
      package_obj: packageObj,
      users: userArray,
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

let addClassCategory = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let classCategory = req.body["class_category"];

    let categoryObj = await server.mc_subdomain.query(
      "SELECT * FROM class_category WHERE category_name = LIKE ?",
      [classCategory]
    );
    if (categoryObj.length > 0) {
      return res.json({
        status: "fail",
        message: "Category Already Exists",
      });
    }

    let inserted = await server.mc_subdomain.query(
      "INSERT INTO class_category (category_name) VALUES (?)",
      [classCategory]
    );

    res.json({
      status: "success",
      message: "Class Category Added Successfully",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let getSingleClassInfo = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];
    let selectedID = req.body["selected_id"];
    let classObj = await server.mc_subdomain.query(
      "SELECT * FROM membership_class_master WHERE id = ?",
      [id]
    );
    let selectedClassObj = await server.mc_subdomain.query(
      "SELECT * FROM membership_class_master WHERE id = ?",
      [selectedID]
    );

    let to_add = 0;
    for (let i in selectedClassObj) {
      let days = selectedClassObj[i]["days"];
      let new_days = classObj[i]["days"];
      let repeat_days = checkDays.filter((value) => newDays.includes(value));

      if (repeat_days.length > 0) {
        if (selectedClassObj[i]["allow_time_conflict"] == 0) {
          let start_time = moment(
            moment().format("Y-MM-DD") +
              " " +
              selectedClassObj[i]["start_time"],
            "Y-MM-DD HH:mm:ss"
          );
          let end_time = moment(
            moment().format("Y-MM-DD") + " " + selectedClassObj[i]["end_time"],
            "Y-MM-DD HH:mm:ss"
          );

          let new_start_time = moment(
            moment().format("Y-MM-DD") + " " + classObj[i]["start_time"],
            "Y-MM-DD HH:mm:ss"
          );
          let new_end_time = moment(
            moment().format("Y-MM-DD") + " " + classObj[i]["end_time"],
            "Y-MM-DD HH:mm:ss"
          );

          if (checkIsTimeBetween(start_time, [new_start_time, new_end_time]))
            to_add = 1;

          if (checkIsTimeBetween(end_time, [new_start_time, new_end_time]))
            to_add = 1;

          if (checkIsTimeBetween(new_start_time, [start_time, end_time]))
            to_add = 1;

          if (checkIsTimeBetween(new_end_time, [start_time, end_time]))
            to_add = 1;

          if (
            temp_start_time == new_start_time &&
            temp_end_time == new_end_time
          )
            to_add = 1;
        }
      }
    }

    if (to_add == 0) {
      let packageObj = await server.mc_subdomain.query(
        "SELECT * FROM class_packages WHERE class_id = ?",
        [id]
      );
      classObj[0]["class_packages"] = packageObj;
      classObj[0]["start_time"] = moment(
        packageObj[0]["start_time"],
        "HH:mm:ss"
      ).format("hh:mm A");
      classObj[0]["end_time"] = moment(
        packageObj[0]["end_time"],
        "HH:mm:ss"
      ).format("hh:mm A");

      res.json({
        status: "success",
        data: classObj[0],
        message: "Data Found",
      });
    } else {
      res.json({
        status: "fail",
        message: "NO Data Found",
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

module.exports = {
  getClassListMonthWise: getClassListMonthWise,
  getClassListDayWise: getClassListDayWise,
  getClassDetail: getClassDetail,
  addClass: addClass,
  updateClass: updateClass,
  deleteClass: deleteClass,
  rescheduleClass: rescheduleClass,
  classDetail: classDetail,
  addClassCategory: addClassCategory,
  getSingleClassInfo: getSingleClassInfo,
};
