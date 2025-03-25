import { motion } from 'framer-motion';
import React from 'react';

const difficulties = [
  { id: 'easy', name: 'Легкий', timePerQuestion: 30 },
  { id: 'medium', name: 'Средний', timePerQuestion: 20 },
  { id: 'hard', name: 'Сложный', timePerQuestion: 15 },
];

const DifficultySelect = ({ onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="difficulty-select"
    >
      <h2>Выберите сложность</h2>
      <div className="difficulty-options">
        {difficulties.map(difficulty => (
          <motion.button
            key={difficulty.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(difficulty)}
            className="difficulty-button"
          >
            <span className="difficulty-name">{difficulty.name}</span>
            <span className="difficulty-time">{difficulty.timePerQuestion}с на вопрос</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DifficultySelect;
