import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const QUESTIONS = [
  { id: 1, text: "How would you rate the overall session?", type: "rating" },
  { id: 2, text: "Was the session content easy to understand?", type: "yesno" },
  { id: 3, text: "How useful was the session for your knowledge?", type: "rating" },
  { id: 4, text: "Was the session interactive and engaging?", type: "yesno" },
  { id: 5, text: "What suggestions would you give to improve future sessions?", type: "text" }
];

export default function App() {
  const questions = QUESTIONS;
  const [studentName, setStudentName] = useState("");
  const [department, setDepartment] = useState("");
  const [sessionTitle, setSessionTitle] = useState("");
  const [answers, setAnswers] = useState({});
  const [page, setPage] = useState("form");
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const answeredCount = useMemo(
    () => questions.filter((q) => answers[q.id]?.trim()).length,
    [questions, answers]
  );

  function updateAnswer(id, value) {
    setAnswers((previous) => ({ ...previous, [id]: value }));
  }

  function newSurvey() {
    
    setAnswers({});
    setStudentName("");
    setDepartment("");
    setSessionTitle("");
    setMessage("");
    setError("");
    setPage("form");
  }

  async function submitFeedback(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (answeredCount !== 5) {
      setError("Please answer all five questions before submitting.");
      return;
    }

    const payload = {
      studentName,
      department,
      sessionName: sessionTitle,
      answers: questions.map((q) => ({
        questionId: q.id,
        question: q.text,
        answer: answers[q.id]
      }))
    };

    try {
      setLoading(true);
      const response = await axios.post(`${API}/feedback`, payload);
      setMessage(response.data.message);
      setAnswers({});
      setPage("success");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit feedback. Check whether the backend and MongoDB are running.");
    } finally {
      setLoading(false);
    }
  }

  async function loadFeedback() {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await axios.get(`${API}/feedback`);
      setFeedbacks(response.data);
      setPage("records");
    } catch {
      setError("Unable to load feedback. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // The five random questions are selected when the form first loads.
  }, []);

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">SF</span><span>Session<span className="brand-light">Feedback</span></span></div>
        <button className="nav-button" onClick={loadFeedback}>View Submitted Feedback</button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">EXPERIMENT 05 · ONLINE SURVEY APPLICATION</p>
          <h1>Your feedback helps<br /><span>make every session better.</span></h1>
          <p className="hero-sub">Share your thoughts about the session. Answer these five questions. Your response is saved to the database.</p>
          <div className="hero-points"><span>✓ 5 feedback questions</span><span>✓ Quick and simple</span><span>✓ MongoDB storage</span></div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="art-circle">✦</div><div className="art-card"><div className="art-lines"><i></i><i></i><i></i></div><div className="art-check">✓</div><strong>Feedback received</strong><small>Your voice matters</small></div></div>
      </section>

      {page === "form" && (
        <section className="survey-card">
          <div className="section-heading">
            <div><p className="eyebrow dark">SESSION SURVEY</p><h2>Tell us about your experience</h2><p className="muted">Fill in your details and answer the five questions below.</p></div>
            <div className="progress"><strong>{answeredCount}/5</strong><span>answered</span></div>
          </div>
          {error && <div className="alert error">{error}</div>}
          <form onSubmit={submitFeedback}>
            <div className="details-grid">
              <label>Student name<input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Enter your full name" required /></label>
              <label>Department<input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Enter your department" required /></label>
              <label>Session name<input value={sessionTitle} onChange={(e) => setSessionTitle(e.target.value)} placeholder="Enter the session name" required /></label>
            </div>
            <div className="question-title"><h3>Feedback questions</h3><span>Answer all five questions</span></div>
            <div className="questions">
              {questions.map((q, index) => (
                <div className="question" key={q.id}>
                  <div className="question-label"><span className="number">{index + 1}</span><div><strong>{q.text}</strong><small>Question {index + 1} of 5</small></div></div>
                  {q.type === "rating" && <div className="rating-options">{[1,2,3,4,5].map((n) => <label className={answers[q.id] === String(n) ? "rating selected" : "rating"} key={n}><input type="radio" name={`q-${q.id}`} value={n} checked={answers[q.id] === String(n)} onChange={(e) => updateAnswer(q.id, e.target.value)} />{n}</label>)}</div>}
                  {q.type === "yesno" && <div className="choice-options">{["Yes", "No"].map((v) => <label className={answers[q.id] === v ? "choice selected" : "choice"} key={v}><input type="radio" name={`q-${q.id}`} value={v} checked={answers[q.id] === v} onChange={(e) => updateAnswer(q.id, e.target.value)} />{v}</label>)}</div>}
                  {q.type === "text" && <textarea rows="3" value={answers[q.id] || ""} onChange={(e) => updateAnswer(q.id, e.target.value)} placeholder="Type your answer here..." />}
                </div>
              ))}
            </div>
            <div className="form-footer"><span>{answeredCount} of 5 questions completed</span><button className="primary-button" type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Feedback →"}</button></div>
          </form>
        </section>
      )}

      {page === "success" && <section className="survey-card success-card"><div className="success-icon">✓</div><p className="eyebrow dark">SUBMISSION COMPLETE</p><h2>Thank you for your feedback!</h2><p className="muted">{message || "Your response has been saved successfully."}</p><div className="success-actions"><button className="primary-button" onClick={newSurvey}>Submit another response</button><button className="secondary-button" onClick={loadFeedback}>View all feedback</button></div></section>}

      {page === "records" && <section className="survey-card">
        <div className="section-heading"><div><p className="eyebrow dark">DATABASE RECORDS</p><h2>Submitted feedback</h2><p className="muted">Responses retrieved from MongoDB.</p></div><button className="secondary-button" onClick={newSurvey}>← Back to survey</button></div>
        {error && <div className="alert error">{error}</div>}
        {feedbacks.length === 0 ? <p className="empty">No feedback submitted yet.</p> : <div className="records">{feedbacks.map((item) => <article className="record" key={item._id}><div className="record-head"><div><h3>{item.studentName}</h3><p>{item.department}</p></div><time>{new Date(item.submittedAt).toLocaleString()}</time></div><div className="session-chip">{item.sessionName}</div><ol>{item.answers.map((a, i) => <li key={`${item._id}-${i}`}><strong>{a.question}</strong><p>{a.answer}</p></li>)}</ol></article>)}</div>}
      </section>}
      <footer>Experiment 5 · Online Survey Application <span>React · Node.js · MongoDB</span></footer>
    </main>
  );
}
