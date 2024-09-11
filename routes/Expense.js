const express = require("express");
const {
  expenseFilter,
  addExpenseType,
  saveExpense,
  deleteExpense,
  updateExpense,
} = require("../controllers/ExpenseController");
const router = express.Router();

router.get("/expense-filter", expenseFilter);
router.get("/add-expense-type", addExpenseType);
router.get("/save-expense", saveExpense);
router.get("/delete-expense", deleteExpense);
router.get("/update-expense", updateExpense);

module.exports = router;
