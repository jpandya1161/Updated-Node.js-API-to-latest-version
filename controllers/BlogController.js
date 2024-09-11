const server = require("../server");
const util = require("util");

const moment = require("moment");

let blogIndex = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let blogObj = await server.mc_subdomain.query(
      "SELECT * FROM blog_master WHERE status = 1"
    );
    for (let i in blogObj) {
      let blogCategoryObj = await server.mc_subdomain.query(
        "SELECT * FROM blog_category WHERE id = ? AND status = 1",
        [blogObj[i]["category"]]
      );
      blogObj[i]["category"] = blogCategoryObj[0];
    }

    res.json({
      status: "success",
      Data: blogObj,
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

let addBlog = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let expertId = req.body["expert_id"];
    let themeId = req.body["theme_id"];
    let title = req.body["blog_title"];
    let videoUrl = req.body["video_url"] || "";
    let blogCategory = req.body["blog_category"];
    let image = req.body["image"] || null;
    let mainThemeName = req.body["main_theme_name"];
    let themeName = req.body["theme_name"];
    let desc = req.body["blog_description"];
    let date = req.body["blog_date"];
    let status = req.body["status"];

    //-------------------ADD IMAGE------------------//

    let photoName = "";
    if (image != null && image != "" && image != "undefined") {
      var path =
        global.IMG_PATH +
        "assets/themes/" +
        mainThemeName +
        "/" +
        themeName +
        "/images/";
      image = new Buffer.from(image, "base64");

      photoName = path + moment().format("YYYY-MM-DD-HH-mm-ss") + "blog.png";
      await fs.writeFileSync(photoName, image);
    }

    let inserted = await server.mc_subdomain.query(
      "INSERT INTO blog_master (expert_id,theme_id,title,video_url,category,image,desc,date,status) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        expertId,
        themeId,
        title,
        videoUrl,
        blogCategory,
        photoName,
        desc,
        date,
        status,
      ]
    );

    res.json({
      status: "success",
      message: "Blog Added",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let changeBlogStatus = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let updated = await server.mc_subdomain.query(
      "UPDATE blog_master SET status = ? WHERE id = ?",
      [req.body["status"], req.body["id"]]
    );

    res.json({
      status: "success",
      message: "Blog Category Updated",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let deleteBlog = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let deleted = await server.mc_subdomain.query(
      "DELETE FROM blog_master WHERE id = ?",
      [req.body["id"]]
    );

    res.json({
      status: "success",
      message: "Blog Delete",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let updateBlog = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];
    let expertId = req.body["expert_id"];
    let themeId = req.body["theme_id"];
    let title = req.body["blog_title"];
    let videoUrl = req.body["video_url"] || "";
    let blogCategory = req.body["blog_category"];
    let image = req.body["image"] || null;
    let mainThemeName = req.body["main_theme_name"];
    let themeName = req.body["theme_name"];
    let desc = req.body["blog_description"];
    let date = req.body["blog_date"];
    let status = req.body["status"];

    //-------------------ADD IMAGE------------------//

    let photoName = "";
    if (image != null && image != "" && image != "undefined") {
      var path =
        global.IMG_PATH +
        "assets/themes/" +
        mainThemeName +
        "/" +
        themeName +
        "/images/";

      let checkpObj = await server.mc_subdomain.query(
        "SELECT * FROM blog_master WHERE id = ?",
        [id]
      );
      if (checkObj[0]["image"] != null && checkObj[0]["image"] != "") {
        fs.unlink = util.promisify(fs.unlink);
        fs.unlink(path + checkObj[0]["image"]);
      }

      image = new Buffer.from(image, "base64");

      photoName = path + moment().format("YYYY-MM-DD-HH-mm-ss") + "blog.png";
      await fs.writeFileSync(photoName, image);
    }

    let inserted = await server.mc_subdomain.query(
      "UPDATE blog_master SET expert_id = ?,theme_id = ?,title = ?,video_url = ?,category = ?,image = ?,desc = ?,date = ?,status = ? WHERE id = ?",
      [
        expertId,
        themeId,
        title,
        videoUrl,
        blogCategory,
        photoName,
        desc,
        date,
        status,
        id,
      ]
    );

    res.json({
      status: "success",
      message: "Blog Updated",
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
  blogIndex: blogIndex,
  addBlog: addBlog,
  changeBlogStatus: changeBlogStatus,
  deleteBlog: deleteBlog,
  updateBlog: updateBlog,
};
