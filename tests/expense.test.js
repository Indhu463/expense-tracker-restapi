const {
  addExpense,
  getExpenses,
  getTotalExpenses,
  getCategoryTotal,
  searchExpenses,
  deleteExpense,
} = require("../src/controllers/expenseController");

const { readExpenses, writeExpenses } = require("../src/utils/fileHandler");

jest.mock("../src/utils/fileHandler");

jest.mock("uuid", () => ({
  v4: () => "test-id-123",
}));

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const sampleExpenses = [
  {
    id: "1",
    title: "Groceries",
    amount: 50,
    category: "Food",
    date: "2024-01-01",
  },
  {
    id: "2",
    title: "Bus ticket",
    amount: 20,
    category: "Transport",
    date: "2024-01-02",
  },
  {
    id: "3",
    title: "Movie night",
    amount: 30,
    category: "Entertainment",
    date: "2024-01-03",
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("addExpense", () => {
  it("returns 400 if required fields are missing", () => {
    const req = { body: { title: "Coffee" } };
    const res = mockResponse();

    addExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Title, amount, and category are required",
      })
    );
  });

  it("returns 400 if amount is not a valid positive number", () => {
    const req = { body: { title: "Coffee", amount: -5, category: "Food" } };
    const res = mockResponse();

    addExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Amount must be a valid number greater than 0",
      })
    );
  });

  it("adds a new expense and returns 201", () => {
    readExpenses.mockReturnValue([...sampleExpenses]);

    const req = {
      body: {
        title: "Coffee",
        amount: 5,
        category: "Food",
        date: "2024-01-04",
      },
    };
    const res = mockResponse();

    addExpense(req, res);

    expect(writeExpenses).toHaveBeenCalledWith([
      ...sampleExpenses,
      {
        id: "test-id-123",
        title: "Coffee",
        amount: 5,
        category: "Food",
        date: "2024-01-04",
      },
    ]);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Expense added successfully" })
    );
  });

  it("defaults the date to now if none is provided", () => {
    readExpenses.mockReturnValue([]);

    const req = { body: { title: "Coffee", amount: 5, category: "Food" } };
    const res = mockResponse();

    addExpense(req, res);

    const [[savedExpenses]] = writeExpenses.mock.calls;
    expect(savedExpenses[0].date).toBeDefined();
  });
});

describe("getExpenses", () => {
  it("returns all expenses when no category filter is given", () => {
    readExpenses.mockReturnValue(sampleExpenses);

    const req = { query: {} };
    const res = mockResponse();

    getExpenses(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(sampleExpenses);
  });

  it("filters expenses by category, case-insensitively", () => {
    readExpenses.mockReturnValue(sampleExpenses);

    const req = { query: { category: "food" } };
    const res = mockResponse();

    getExpenses(req, res);

    expect(res.json).toHaveBeenCalledWith([sampleExpenses[0]]);
  });
});

describe("getTotalExpenses", () => {
  it("returns the sum of all expense amounts", () => {
    readExpenses.mockReturnValue(sampleExpenses);

    const req = {};
    const res = mockResponse();

    getTotalExpenses(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ total: 100 });
  });

  it("returns 0 when there are no expenses", () => {
    readExpenses.mockReturnValue([]);

    const req = {};
    const res = mockResponse();

    getTotalExpenses(req, res);

    expect(res.json).toHaveBeenCalledWith({ total: 0 });
  });
});

describe("getCategoryTotal", () => {
  it("returns the total for a given category", () => {
    readExpenses.mockReturnValue(sampleExpenses);

    const req = { params: { category: "Food" } };
    const res = mockResponse();

    getCategoryTotal(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ category: "Food", total: 50 });
  });

  it("returns 0 for a category with no matching expenses", () => {
    readExpenses.mockReturnValue(sampleExpenses);

    const req = { params: { category: "Utilities" } };
    const res = mockResponse();

    getCategoryTotal(req, res);

    expect(res.json).toHaveBeenCalledWith({ category: "Utilities", total: 0 });
  });
});

describe("searchExpenses", () => {
  it("returns 400 if no query is provided", () => {
    const req = { query: {} };
    const res = mockResponse();

    searchExpenses(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("matches expenses by title", () => {
    readExpenses.mockReturnValue(sampleExpenses);

    const req = { query: { q: "movie" } };
    const res = mockResponse();

    searchExpenses(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([sampleExpenses[2]]);
  });

  it("matches expenses by category", () => {
    readExpenses.mockReturnValue(sampleExpenses);

    const req = { query: { q: "transport" } };
    const res = mockResponse();

    searchExpenses(req, res);

    expect(res.json).toHaveBeenCalledWith([sampleExpenses[1]]);
  });

  it("returns an empty array when nothing matches", () => {
    readExpenses.mockReturnValue(sampleExpenses);

    const req = { query: { q: "zzz" } };
    const res = mockResponse();

    searchExpenses(req, res);

    expect(res.json).toHaveBeenCalledWith([]);
  });
});

describe("deleteExpense", () => {
  it("returns 404 if the expense does not exist", () => {
    readExpenses.mockReturnValue(sampleExpenses);

    const req = { params: { id: "does-not-exist" } };
    const res = mockResponse();

    deleteExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(writeExpenses).not.toHaveBeenCalled();
  });

  it("deletes the matching expense and returns 200", () => {
    readExpenses.mockReturnValue([...sampleExpenses]);

    const req = { params: { id: "2" } };
    const res = mockResponse();

    deleteExpense(req, res);

    expect(writeExpenses).toHaveBeenCalledWith([
      sampleExpenses[0],
      sampleExpenses[2],
    ]);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
