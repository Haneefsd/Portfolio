import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const askQuestion = useCallback(async () => {
    if (!question.trim()) {
      setError("Please enter a valid question!");
      return;
    }

    setLoading(true);
    setError(null);
    setAnswer("");

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch answer from server.");
      }

      const data = await response.json();
      setAnswer(data.answer || "No answer provided.");
    } catch (err) {
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  }, [question]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      askQuestion();
    }
  };

  return (
    <div className="app-wrapper">
      <motion.div
        className="container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="neon-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Programming Q&A Bot
        </motion.h1>

        <motion.input
          className="neon-input"
          type="text"
          placeholder="Ask a programming question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          whileFocus={{ scale: 1.02 }}
          disabled={loading}
          aria-label="Programming question input"
        />

        <motion.button
          className="neon-button"
          onClick={askQuestion}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading || !question.trim()}
          aria-label="Submit question"
        >
          {loading ? "Asking..." : "Ask"}
        </motion.button>

        <AnimatePresence>
          {error && (
            <motion.p
              className="error-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {answer && (
            <motion.div
              className="answer-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="answer-title">Answer:</h3>
              <p>{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;