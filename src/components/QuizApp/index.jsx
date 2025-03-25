import React, { useCallback, useEffect, useState } from 'react';
import { questions } from '../../constants';
import DetailedResult from '../DetailedResult';
import DifficultySelect from '../DifficultySelect';
import QuestionCard from '../QuestionCard';
import StatusBar from '../StatusBar';

const QuizApp = () => {
  const [difficulty, setDifficulty] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);

  const handleTimeout = useCallback(() => {
    if (timeLeft === 0 && !isFinished) {
      setIsFinished(true);
    }
  }, [timeLeft, isFinished]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    handleTimeout();
  }, [timeLeft, isFinished, handleTimeout]);

  const handleAnswer = isCorrect => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setTimeLeft(30);
    } else {
      setIsFinished(true);
    }
  };

  if (!difficulty) {
    return <DifficultySelect onSelect={setDifficulty} />;
  }

  if (isFinished) {
    return <DetailedResult score={score} total={questions.length} />;
  }

  return (
    <div className="quiz-app">
      <StatusBar current={currentQuestion + 1} total={questions.length} />
      <QuestionCard
        question={questions[currentQuestion]}
        timeLeft={timeLeft}
        onAnswer={handleAnswer}
      />
    </div>
  );
};

export default QuizApp;
