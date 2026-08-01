const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../../expenses.json");

const readExpenses = () => {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, "utf-8");
  return raw ? JSON.parse(raw) : [];
};

const writeExpenses = (expenses) => {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(expenses, null, 2));
  } catch (error) {
    console.error("Error writing expenses file:", error.message);
  }
};

module.exports = {
  readExpenses,
  writeExpenses,
};
