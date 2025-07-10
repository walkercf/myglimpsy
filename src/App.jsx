import React, { useState, useEffect } from "react";

const questions = [
  {
    question: "What type of vehicle is the man getting on?",
    options: ["bus", "car", "bike", "train"],
    answer: "bus",
    points: 1,
  },
  {
    question: "What color is the bus?",
    options: ["blue", "red", "green", "yellow"],
    answer: "red",
    points: 2,
  },
  {
    question: "Where is the bus headed?",
    options: ["downtown", "airport", "suburbs", "station"],
    answer: "downtown",
    points: 3,
  },
  {
    question: "What color is the man's jacket?",
    options: ["black", "blue", "brown", "gray"],
    answer: "brown",
    points: 4,
  },
  {
    question: "What time of day is it?",
    options: ["10:30am", "10:30pm", "4:30pm", "2:30pm"],
    answer: "10:30am",
    points: 5,
  },
];

const imageUrl = "https://i.imgur.com/HSBS4CF.png";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [usedShowAgain, setUsedShowAgain] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  useEffect(() => {
    if (gameStarted) {
      setShowImage(true);
      const timer = setTimeout(() => setShowImage(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [gameStarted]);

  const handleShowAgain = () => {
    if (!usedShowAgain) {
      setShowImage(true);
      setUsedShowAgain(true);
      setTimeout(() => setShowImage(false), 1000);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer("");
    setSubmitted(false);
    setUsedShowAgain(false);
    setGameFinished(false);
    setUserAnswers([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const currentQuestion = questions[currentQuestionIndex];
    setUserAnswers([...userAnswers, selectedAnswer]);
    if (selectedAnswer === currentQuestion.answer) {
      setScore(score + currentQuestion.points);
    }
  };

  const handleNext = () => {
    setSubmitted(false);
    setSelectedAnswer("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setGameFinished(true);
      setGameStarted(false);
    }
  };

  const shareScore = () => {
    const shareText = `I scored ${score} out of ${totalPoints} points on My Glimpsy! Can you beat me? Try it now at myglimpsy.com`;
    navigator.clipboard.writeText(shareText);
    alert("Score copied to clipboard! Share it on your favorite social media.");
  };

  if (!gameStarted && !gameFinished) {
    return (
      <main
        style={{
          padding: 20,
          fontFamily: "Arial, sans-serif",
          maxWidth: 600,
          margin: "auto",
          textAlign: "center",
        }}
      >
        <h1>My Glimpsy</h1>
        <ul style={{ fontSize: 16, textAlign: "left", maxWidth: 500, margin: "20px auto" }}>
          <li>See an image for 4 seconds.</li>
          <li>Answer 5 questions about details in the image.</li>
          <li>Questions get harder and worth more points.</li>
          <li>You can see the image again only once for 1 second during the questions.</li>
          <li>Try to get as many points as possible. Good luck!</li>
        </ul>
        <button
          onClick={handleStartGame}
          style={{ fontSize: 18, padding: "10px 20px" }}
        >
          Start Game
        </button>
      </main>
    );
  }

  if (gameFinished) {
    return (
      <main
        style={{
          padding: 20,
          fontFamily: "Arial, sans-serif",
          maxWidth: 600,
          margin: "auto",
          textAlign: "center",
        }}
      >
        <h2>{score === totalPoints ? "Congratulations!" : "Good effort!"}</h2>
        <p>
          Your final score is {score} out of {totalPoints} points.
        </p>
        <p>Try again tomorrow for a new challenge!</p>

        <img
          src={imageUrl}
          alt="Review"
          style={{ maxWidth: "100%", maxHeight: "60vh", marginTop: 20 }}
        />

        <h3>Answer Recap:</h3>
        <ul style={{ textAlign: "left" }}>
          {questions.map((q, i) => (
            <li key={i} style={{ marginBottom: 10 }}>
              <strong>Q{i + 1}:</strong> {q.question}
              <br />
              Your answer:{" "}
              <span
                style={{
                  color:
                    userAnswers[i] === q.answer ? "green" : "red",
                }}
              >
                {userAnswers[i] || "(No answer)"}
              </span>
              <br />
              Correct answer: {q.answer}
            </li>
          ))}
        </ul>

        <button
          onClick={shareScore}
          style={{ padding: "10px 20px", marginTop: 20 }}
        >
          Share Your Score
        </button>
      </main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const nextPoints =
    currentQuestionIndex < questions.length - 1
      ? questions[currentQuestionIndex + 1].points
      : null;

  return (
    <main
      style={{
        padding: 20,
        fontFamily: "Arial, sans-serif",
        maxWidth: 600,
        margin: "auto",
      }}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt="QuickLook"
          style={{
            maxWidth: "100%",
            maxHeight: "80vh",
            display: "block",
            margin: "auto",
          }}
        />
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <p>{currentQuestion.question}</p>
            {currentQuestion.options.map((option) => (
              <label
                key={option}
                style={{ display: "block", marginBottom: 8 }}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={() => setSelectedAnswer(option)}
                  disabled={submitted}
                />{" "}
                {option}
              </label>
            ))}

            <button
              type="submit"
              disabled={submitted || selectedAnswer === ""}
              style={{ marginTop: 10 }}
            >
              Submit
            </button>
          </form>

          {submitted && (
            <p style={{ marginTop: 10 }}>
              {selectedAnswer === currentQuestion.answer
                ? `Correct! You earned ${currentQuestion.points} point${
                    currentQuestion.points > 1 ? "s" : ""
                  }.`
                : `Incorrect. The correct answer is: ${currentQuestion.answer}.`}
            </p>
          )}

          {submitted && (
            <button onClick={handleNext} style={{ marginTop: 10 }}>
              {nextPoints
                ? `Try ${nextPoints} point question`
                : "Finish Game"}
            </button>
          )}

          {!usedShowAgain && (
            <button
              onClick={handleShowAgain}
              disabled={usedShowAgain}
              style={{ marginTop: 20, backgroundColor: "#eee", padding: "8px 12px" }}
            >
              Show Image Again (1 time)
            </button>
          )}

          <p style={{ marginTop: 20 }}>Current Score: {score}</p>
        </>
      )}
    </main>
  );
}
