const server = require("../server");
const util = require("util");

const moment = require("moment");

let expenseFilter = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let employeeId = req.body["employee_id"] || "Admin";
    let expenseType = req.body["expense_type"] || null;
    let startDate = req.body["start_date"] || null;
    let endDate = req.body["end_date"] || null;

    let query = "WHERE";
    if (employeeId != null && employeeId != "")
      query += " created_by = " + employeeId;
    if (expenseId != null && expenseId != "")
      query += " type_id = " + expenseType;
    if (startDate != null && startDate != "")
      query += " expense_date <= " + startDate;
    if (endDate != null && endDate != "")
      query += " expense_date >= " + endDate;

    if (query == "WHERE") query = "";

    let expenseObj = await server.mc_subdomain.query(
      "SELECT * FROM expenses " + query + " LIMIT 10"
    );

    res.json({
      status: "success",
      data: expenseObj,
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

let addExpenseType = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let inserted = await server.mc_subdomain.query(
      "INSERT INTO expense_type (type) VALUES (?)",
      [req.body["type"]]
    );

    res.json({
      status: "success",
      message: "Expense Type Added",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let saveExpense = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let type = req.body["type"];
    let amount = req.body["amount"];
    let date = req.body["date"];
    let note = req.body["note"];
    let employee = req.body["employee"];

    let inserted = await server.mc_subdomain.query(
      "INSERT INTO expenses (type_id,amount,expense_date,note,created_by) VALUES (?,?,?,?,?)",
      [type, amount, date, note, employee]
    );

    res.json({
      status: "success",
      message: "Expense Type Added",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let deleteExpense = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let deleted = await server.mc_subdomain.query(
      "DELETE FROM expenses WHERE id = ?",
      [req.body["id"]]
    );

    res.json({
      status: "success",
      message: "Expense Deleted",
    });
  } catch (e) {
    console.log(e);
    res.json({
      message: "Something is not right!",
      status: "fail",
    });
  }
};

let updateExpense = async (req, res) => {
  try {
    server.mc_subdomain.query = util.promisify(server.mc_subdomain.query);

    let id = req.body["id"];
    let type = req.body["type"];
    let amount = req.body["amount"];
    let date = req.body["date"];
    let note = req.body["note"];
    let employee = req.body["employee"];

    let updated = await server.mc_subdomain.query(
      "UPDATE expenses SET type_id = ?,amount = ?,expense_date = ?,note = ?,created_by = ? WHERE id = ?",
      [type, amount, date, note, employee, id]
    );

    res.json({
      status: "success",
      message: "Expense Updated",
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
  expenseFilter: expenseFilter,
  addExpenseType: addExpenseType,
  saveExpense: saveExpense,
  deleteExpense: deleteExpense,
  updateExpense: updateExpense,
};
