import { motion } from 'framer-motion';
import React from 'react';

const StatusBar = ({ current, total }) => {
  const progress = (current / total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="status-bar"
    >
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="progress-text">
        Вопрос {current} из {total}
      </div>
    </motion.div>
  );
};

export default StatusBar;
