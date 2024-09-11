var server = require("../server");
var util = require("util");

var moment = require("moment");
var _ = require("underscore");

let categoryIndex = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let resp = {};

    let categoryObj = await server.mc_subdomain.query(
      "SELECT * FROM category_master"
    );
    categoryObj = _.groupBy(categoryObj, (category) => {
      return category["category_name"];
    });
    // categoryObj = _.values(categoryObj);

    for (let i in categoryObj) {
      let id = (parent = status = "");

      for (let j in categoryObj[i]) {
        id += categoryObj[i][j]["id"] + ",";
        parent += categoryObj[i][j]["cat_parent_id"] + ",";
        status += categoryObj[i][j]["status"] + ",";
        console.log(id, parent, status);
      }

      resp[i] = {
        id: id,
        categroy_name: i,
        cat_parent_id: parent,
        status: status,
      };
    }

    res.json({
      status: "success",
      data: _.values(resp),
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

let addCategory = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let categoryName = req.body["category_name"];
    let parentCategory = req.body["parent_category"];
    let categoryStatus = req.body["category_status"];

    if (parentCategory == 0) {
      return res.json({
        status: "fail",
        message: "Parent Category can't be 0 (zero)",
      });
    } else {
      for (let i in parentCategory.split(",")) {
        let inserted = await server.mc_subdomain.query(
          "INSERT INTO category_masterS (category_name,cat_parent_id,status) VALUES (?,?,?)",
          [categoryName, parentCategory.split(",")[i], categoryStatus]
        );
      }

      res.json({
        status: "success",
        message: "Category Added Successfully",
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

let changeStatus = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];
    let status = req.body["status"];

    let updated = await server.mc_subdomain.query(
      "UPDATE category_master SET status = ? WHERE id IN (?)",
      [status, id]
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

let deleteCategory = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];

    let deleted = await server.mc_subdomain.query(
      "DELETE FROM category_master WHERE id IN (?)",
      [id]
    );

    res.json({
      status: "success",
      message: "Category Deleted",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let updateCategory = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let ids = req.body["ids"].split(",");
    let parent = req.body["parent"].split(",");
    let categoryName = req.body["name"];

    let updated = [];
    let deleted = [];
    let diff = [];

    for (let i in ids) {
      let categoryObj = await server.mc_subdomain.query(
        "SELECT * FROM category_master WHERE id = ?",
        [ids[i]]
      );
      if (parent.indexOf(categoryObj[0]["cat_parent_id"]) != -1) {
        updated = await server.mc_subdomain.query(
          "UPDATE category_master SET category_name = ? WHERE id = ?",
          [categoryName, ids[i]]
        );
        diff.push(categoryObj[0]["cat_parent_id"]);
      } else {
        deleted = await server.mc_subdomain.query(
          "DELETE FROM category_master WHERE id = ?",
          [ids[i]]
        );
      }
    }

    if (_.difference(parent, diff).length > 0) {
      let items = _.difference(parent, diff);
      for (let i in items) {
        let inserted = await server.mc_subdomain.query(
          "INSERT INTO category_master (category_name,cat_parent_id,status) VALUES (?,?,?)",
          [categoryName, items[i], 1]
        );
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

module.exports = {
  categoryIndex: categoryIndex,
  addCategory: addCategory,
  changeStatus: changeStatus,
  deleteCategory: deleteCategory,
  updateCategory: updateCategory,
};
