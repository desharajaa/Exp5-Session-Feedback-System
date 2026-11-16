# EXPERIMENT 5 – ONLINE SURVEY / SESSION FEEDBACK SYSTEM

A full-stack React + Vite, Node.js + Express, MongoDB application.
It displays 5 random questions from a 10-question bank and stores each submitted session feedback document in MongoDB.

## Requirements
- Node.js LTS and npm
- MongoDB local installation OR MongoDB Atlas account
- VS Code

## Folder structure
```text
Exp5_Session_Feedback_System/
  client/
    index.html
    package.json
    vite.config.js
    src/
      main.jsx
      App.jsx
      index.css
  server/
    package.json
    server.js
    .env.example
    .gitignore
```

## Step-by-step execution in VS Code

1. Extract `Exp5_Session_Feedback_System.zip`.
2. Open VS Code → File → Open Folder → select `Exp5_Session_Feedback_System`.
3. Open Terminal → New Terminal.
4. Install backend packages:
   ```bash
   cd server
   npm install
   ```
5. Create a file named `.env` inside the `server` folder. Copy the contents of `.env.example` into it.
6. Set `MONGO_URI` in `.env`:
   - Local MongoDB: `mongodb://127.0.0.1:27017/exp5_feedback`
   - MongoDB Atlas: paste your own Atlas connection string, replacing `<db_password>` with your database user's password. Do not share this file or upload it to GitHub.
7. In the same terminal, start backend:
   ```bash
   npm run dev
   ```
   Expected message: `MongoDB connected` and `Server running at http://localhost:5000`
8. Keep this terminal running. Open a second terminal in VS Code (Terminal → New Terminal).
9. Run frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```
10. Open the URL shown by Vite, usually `http://localhost:5173`.
11. Enter student name, email and session title. Answer all 5 random questions and click Submit Feedback.
12. Click **View Submitted Feedback** to see saved records. These records are fetched from MongoDB through the backend API.
13. To stop the servers, press `Ctrl + C` in both terminals.

## MongoDB verification
In MongoDB Compass, connect to the same MongoDB URI and open:
- Database: `exp5_feedback`
- Collection: `feedbacks`

Each submission is stored as one document with student name, department, session name, the five question-and-answer pairs, and submitted date.

## API endpoints
- `GET http://localhost:5000/api/health` – server/database status
- `POST http://localhost:5000/api/feedback` – save a feedback submission
- `GET http://localhost:5000/api/feedback` – retrieve all feedback submissions

## Important
- The `.env` file contains your private database connection string. Never commit it to GitHub.
- The form contains exactly five fixed feedback questions.
- This is a lab/demo application. Add authentication and access controls before using it with real confidential student data.
