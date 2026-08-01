const { v4: uuidv4 } = require("uuid");

const { readExpenses, writeExpenses } = require("../utils/fileHandler");
const { error } = require("console");

const addExpense = (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        message: "Title, amount, and category are required",
      });
    }

    // i added this part
    if (
      amount === undefined ||
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        message: "Amount must be a valid number greater than 0",
      });
    }

    const expense = readExpenses();

    const newExpense = {
      id: uuidv4(),
      title,
      amount: Number(amount),
      category,
      date: date || new Date().toLocaleDateString("en-IN"),
    };
    expense.push(newExpense);
    writeExpenses(expense);
    return res.status(201).json({
      message: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went worng while adding the expense",
      error: error.message,
    });
  }
};
const getExpenses = (req, res) => {
  try {
    const expense = readExpenses();
    const { category } = req.query;

    const result = category
      ? expense.filter(
          (expense) => expense.category.toLowerCase() === category.toLowerCase()
        )
      : expense;
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({
      message: "Somthing went wrong while fetching expenses",
      error: err.message,
    });
  }
};
const getTotalExpenses = (req, res) => {
  try {
    const expenses = readExpenses();
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return res.status(200).json({ total });
  } catch (error) {
    return res.status(500).json({
      message: "Somthing went wrong while calulating total expenses",
      error: error.message,
    });
  }
};
const getCategoryTotal = (req, res) => {
  try {
    const { category } = req.params;
    const expenses = readExpenses();

    const filterdList = expenses.filter(
      (expense) => expense.category.toLowerCase() === category.toLowerCase()
    );

    const total = filterdList.reduce((sum, exp) => sum + exp.amount, 0);

    return res.status(200).json({ category, total });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while calulating category total",
      error: error.message,
    });
  }
};
const deleteExpense = (req, res) => {
  try {
    const { id } = req.params;
    const expenses = readExpenses();

    const expExists = expenses.some((expense) => expense.id == id);

    if (!expExists)
      return res.status(404).json({ message: "Expense not found" });

    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    writeExpenses(updatedExpenses);
    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while deleting expense",
      error: error.message,
    });
  }
};

const searchExpenses = (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        message: "A keyword to search is required",
      });
    }

    const expenses = readExpenses();
    const keyword = q.toLowerCase();

    const result = expenses.filter(
      (expense) =>
        expense.title.toLowerCase().includes(keyword) ||
        expense.category.toLowerCase().includes(keyword)
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while searching expense",
      error: error.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  getCategoryTotal,
  getTotalExpenses,
  deleteExpense,
  searchExpenses,
};
