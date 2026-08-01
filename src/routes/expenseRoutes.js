const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpenses,
  getTotalExpenses,
  getCategoryTotal,
  deleteExpense,
  searchExpenses,
} = require("../controllers/expenseController");

router.post("/", addExpense);
router.get("/", getExpenses);
router.get("/total", getTotalExpenses);
router.get("/total/:category", getCategoryTotal);
router.get("/search", searchExpenses);
router.get("/:id", deleteExpense);

module.exports = router;
