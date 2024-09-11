const server = require("../server");
const util = require("util");

const moment = require("moment");

let blogCategoryIndex = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let blogObj = await server.mc_subdomain.query(
      "SELECT * FROM blog_category"
    );

    res.json({
      status: "success",
      data: blogObj,
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

let addBlogCategory = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let inserted = await server.mc_subdomain.query(
      "INSERT INTO blog_category (cat_name,status) VALUES (?,?)",
      [req.body["category_name"], req.body["status"]]
    );

    res.json({
      status: "success",
      message: "Blog Category Added",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let changeBlogCatgoryStatus = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let updated = await server.mc_subdomain.query(
      "UPDATE blog_category SET status = ? WHERE id = ?",
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

let deleteBlogCategory = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let deleted = await server.mc_subdomain.query(
      "DELETE FROM blog_category WHERE id = ?",
      [req.body["id"]]
    );

    res.json({
      status: "success",
      message: "Blog Category Delete",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let updateBlogCategory = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let updated = await server.mc_subdomain.query(
      "UPDATE blog_category SET cat_name = ? WHERE id = ?",
      [req.body["category_name"], req.body["id"]]
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

module.exports = {
  blogCategoryIndex: blogCategoryIndex,
  addBlogCategory: addBlogCategory,
  changeBlogCatgoryStatus: changeBlogCatgoryStatus,
  deleteBlogCategory: deleteBlogCategory,
  updateBlogCategory: updateBlogCategory,
};
