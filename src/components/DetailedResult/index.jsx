import { motion } from 'framer-motion';
import React from 'react';

const DetailedResult = ({ score, total }) => {
  const percentage = Math.round((score / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="detailed-result"
    >
      <h2>Результаты теста</h2>
      <div className="score-container">
        <div className="score-circle">
          <span className="score">{percentage}%</span>
        </div>
        <div className="score-details">
          <p>
            Правильных ответов: {score} из {total}
          </p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.reload()}
        className="restart-button"
      >
        Начать заново
      </motion.button>
    </motion.div>
  );
};

export default DetailedResult;
