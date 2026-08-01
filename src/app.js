const express = require("express");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();
app.use(express.json());

app.use("/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Expense Tracker API is running",
  });
});

module.exports = app;
