# AI_NOTES.md

I used Claude and ChatGPT throughout this project to speed up boilerplate and reduce time spent on repetitive CRUD logic. Below is an honest breakdown of what came from AI, what I changed, and what I verified myself.

## 1. AI-generated vs. self-written

**AI-generated (Claude):**

-`Boilerplate code` - I asked AI to provide some boilerplate code and a basic structure for the REST API, including the controller, routes, file handling, and testing setup. I then adapted and modified the generated code according to my project's structure, requirements, and implementation.

- `utils/fileHandler.js` —I used AI to generate the initial boilerplate for the JSON file helper functions. I modified the file handling code to automatically create the data file when expenses are first written, and to return an empty array if the file does not yet exist.

- `tests/expenseController.test.js` — the full Jest test suite, including mocking `fileHandler` and `uuid`, and test cases for validation errors, successful adds, filtering, totals, search, and delete.

**Self-written / self-decided:**

-`controllers/expenseController.js` - I then adapted and modified the generated code according to my project's structure, requirements, and implementation.

- `routes/expenseRoutes.js` - I wrote the API routes myself based on the project requirements and connected them to the appropriate controller functions.

## 2. What I validated, tested, or changed — and why

- Ran `npm test` against the generated suite on a clean checkout to confirm it actually passes before relying on it.

- `controllers/expenseController.js` - The AI initially suggested using isNaN(amount) for amount validation. I modified the validation logic to perform stricter checks that correctly validate the input type and ensure the amount is a valid positive number, making the validation more robust and consistent with the project requirements.

- `testing using postman` - Manually tested each endpoint with Postman to confirm status codes and response shapes matched what the tests expected.

-I reviewed all AI-generated code before including it in the final solution.

## 3. AI suggestions I didn't use

- claude suggested different one but i thought this format is suitable so i changed date format to Date().toLocaleDateString("en-IN"),
- I modified the validation logic because the claude's given logic doesn't pass the test case.
  -Using MongoDB -Assignment explicitly allowed JSON storage, so a database would increase complexity unnecessarily.
