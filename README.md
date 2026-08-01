Smart Expense Tracker API

A simple REST API for tracking personal expenses.
The API supports creating, viewing, filtering, searching, calculating totals, and deleting expenses.
Expense data is stored locally in a JSON file, so no database setup is required.

Tech Stack

Node.js and Express.js
JavaScript
Jest(for testing)
uuid(for unique ID's)

Project Structure

expense-tracker-restapi/
│
├── src/
│ ├── controllers/
│ │ └── expenseController.js
│ │
│ ├── routes/
│ │ └── expenseRoutes.js
│ │
│ ├── utils/
│ │ └── fileHandler.js
│ │
│ ├── app.js
│ └── server.js
│
├── tests/
│ └── expense.test.js
│
├── expenses.json
├── AI_NOTES.md
├── package.json
├── package.json
└── README.md

Installation

Clone the repository and navigate to the project directory:
git clone <your-github-repository-url>
cd expense-tracker-restapi

Install the requiired dependencies:
npm install

Start the Server

Run the following command:

npm start

The server will start at:

http://127.0.0.1:4000

Run Tests

Run the automated test suite using:

npm test

The test suite covers:

Adding an expense
Required field validation
Amount validation
Default date handling
Retrieving all expenses
Filtering by category
Calculating total expenses
Calculating category-wise totals
Searching by title
Searching by category
Handling search with no results
Deleting an expense
Handling deletion of a non-existent expense

API Endpoints

Method Endpoint Description
POST /api/expenses  
=> Add a new expense

GET /api/expenses  
 =>Get all expenses (optional ?category=)

GET /api/expenses/search?q=
=> Search expenses by title or category

GET /api/expenses/total  
=>Get total of all expenses

GET /api/expenses/category/:category  
=>Get total for a specific category

DELETE /api/expenses/:id  
=> Delete an expense by ID

Example Expense

{
"id": "test-id-123",
"title": "Grocery Shopping",
"amount": 500,
"category": "Food",
"date": "2026-08-01"
}

Future Improvements

Possible future improvements include:
Database integration
Authentication and authorization
Update/edit expense functionality
Monthly expense summaries
Docker support
OpenAPI/Swagger documentation

Author
Indhu V

Built as part of the Software Engineering Apprenticeship Program 2026 Take-Home Assignment.
