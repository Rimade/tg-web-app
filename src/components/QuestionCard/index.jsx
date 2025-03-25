import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

const QuestionCard = ({ question, timeLeft, onAnswer }) => {
  const [isAnswered, setIsAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const correctAnswer = question.answers.find(a => a.isCorrect);
    const wrongAnswers = question.answers.filter(a => !a.isCorrect);
    const randomWrongAnswer = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];

    setAnswers([correctAnswer, randomWrongAnswer].sort(() => Math.random() - 0.5));
  }, [question]);

  const handleAnswerClick = answer => {
    if (isAnswered) return;
    setIsAnswered(true);
    onAnswer(answer.isCorrect);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="question-card"
    >
      <div className="question-text">{question.text}</div>
      <div className="time-left" style={{ color: timeLeft <= 5 ? 'red' : 'inherit' }}>
        Осталось времени: {timeLeft}с
      </div>
      <div className="answers">
        {answers.map((answer, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAnswerClick(answer)}
            disabled={isAnswered}
            className={`answer-button ${isAnswered ? 'disabled' : ''}`}
          >
            {answer.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
