var server = require("../server");
var util = require("util");
var moment = require("moment");

let addClasses = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let title = req.body["title"];
    let desc = req.body["description"];
    let employeeId = req.body["employee_id"];
    let location = req.body["location"];
    let room = req.body["room"];
    let price = req.body["price"];
    let availableSpots = req.body["available_spots"];
    let video = req.body["video"] || null;
    let image = req.body["image"] || null;
    let isDaily = req.body["is_daily"];
    let days = req.body["days"];
    let startDate = req.body["start_date"];
    let endDate = req.body["end_date"];
    let startTime = req.body["start_time"];
    let endTime = req.body["end_time"];
    let status = req.body["status"];

    let photoName = "";
    if (image != null && image != "" && image != "undefined") {
      var path = global.IMG_PATH + "assets/images/expert/video/";
      image = new Buffer.from(image, "base64");

      photoName = path + moment().format("YYYY-MM-DD-HH-mm-ss") + "class.png";
      await fs.writeFileSync(photoName, image);
    }

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

    let classObj = await server.mc_subdomain.query(
      "SELECT * FROM class_master WHERE title = ? AND location = ? AND start_date = ?",
      [title, location, startDate]
    );
    if (classObj.length > 0) {
      let inserted = await server.mc_subdomain.query(
        "INSERT INTO class_master (title,description,is_daily,days,employee_id,location,image,video_url,price,room,available_spots,start_date,end_date,start_time,end_time,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          title,
          desc,
          isDaily,
          days,
          employeeId,
          location,
          photoName,
          videoURL,
          price,
          room,
          availableSpots,
          isDaily == 1 ? "0000-00-00" : startDate,
          isDaily == 1 ? "0000-00-00" : endDate,
          startTime,
          endTime,
          status,
        ]
      );

      res.json({
        status: "success",
        message: "Class Created",
      });
    } else {
      res.json({
        status: "fail",
        message: "Class Already Exists",
      });
    }
  } catch (ex) {
    console.log(ex);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let updateClasses = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];
    let title = req.body["title"];
    let desc = req.body["description"];
    let employeeId = req.body["employee_id"];
    let location = req.body["location"];
    let room = req.body["room"];
    let price = req.body["price"];
    let availableSpots = req.body["available_spots"];
    let video = req.body["video"] || null;
    let image = req.body["image"] || null;
    let isDaily = req.body["is_daily"];
    let days = req.body["days"];
    let startDate = req.body["start_date"];
    let endDate = req.body["end_date"];
    let startTime = req.body["start_time"];
    let endTime = req.body["end_time"];
    let status = req.body["status"];

    let photoName = "";
    if (image != null && image != "" && image != "undefined") {
      var path = global.IMG_PATH + "assets/images/expert/video/";

      let checkpObj = await server.mc_subdomain.query(
        "SELECT * FROM class_master WHERE id = ?",
        [id]
      );
      if (checkObj[0]["image"] != null && checkObj[0]["image"] != "") {
        fs.unlink = util.promisify(fs.unlink);
        fs.unlink(
          global.IMG_PATH + "assets/images/expert/video/" + checkObj[0]["image"]
        );
      }

      image = new Buffer.from(image, "base64");

      photoName = path + moment().format("YYYY-MM-DD-HH-mm-ss") + "class.png";
      await fs.writeFileSync(photoName, image);
    }

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

    let updated = await server.mc_subdomain.query(
      "UPDATE class_master SET title = ?,description = ?,is_daily = ?,days = ?,employee_id = ?,location = ?,image = ?,video_url = ?,price = ?,room = ?,available_spots = ?,start_date = ?,end_date = ?,start_time = ?,end_time = ?,status = ? WHERE id = ?",
      [
        title,
        desc,
        isDaily,
        days,
        employeeId,
        location,
        photoName,
        videoURL,
        price,
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

    res.json({
      status: "success",
      message: "Class Updated",
    });
  } catch (ex) {
    console.log(ex);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let deleteClasses = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];

    let checkpObj = await server.mc_subdomain.query(
      "SELECT * FROM class_master WHERE id = ?",
      [id]
    );
    if (checkObj[0]["image"] != null && checkObj[0]["image"] != "") {
      fs.unlink = util.promisify(fs.unlink);
      fs.unlink(
        global.IMG_PATH + "assets/images/expert/video/" + checkObj[0]["image"]
      );
    }

    let deleted = await server.mc_subdomain.query(
      "DELETE FROM class_master WHERE id = ?",
      [id]
    );

    res.json({
      status: "success",
      message: "Class Deleted",
    });
  } catch (ex) {
    console.log(ex);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let classesDetail = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    id = req.body["id"];
    loginAs = req.body["login_as"];

    let classObj = await server.mc_subdomain.query(
      "SELECT c.*,c.id,c.title, c.start_date, c.start_time, c.end_time, c.location, c.available_spots, c.description, e.user_name AS teacher_name, u.user_name FROM class_master c, user_class_master uc, user_master u, employee_master e WHERE c.id = uc.class_id AND u.id = uc.user_id AND c.id = ? AND e.id = c.employee_id",
      [id]
    );
    if (classObj.length == 0) {
      classObj = await server.mc_subdomain.query(
        "SELECT c.*,c.id,c.title, c.start_date, c.start_time, c.end_time, c.location, c.available_spots, c.description,e.user_name AS teacher_name FROM class_master c,employee_master e WHERE c.id = ? AND c.employee_id=e.id",
        [id]
      );
    }

    res.json({
      status: "success",
      data: classObj[0],
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

module.exports = {
  addClasses: addClasses,
  updateClasses: updateClasses,
  deleteClasses: deleteClasses,
  classesDetail: classesDetail,
};
