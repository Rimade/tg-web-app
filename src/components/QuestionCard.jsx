import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';

function QuestionCard({ question, currentQuestion, totalQuestions, onAnswer, timeLeft }) {
	const [usedHint, setUsedHint] = useState(false);
	const [filteredAnswers, setFilteredAnswers] = useState([]);
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [showResult, setShowResult] = useState(false);

	useEffect(() => {
		setUsedHint(false);
		setFilteredAnswers(question.answers);
		setSelectedAnswer(null);
		setShowResult(false);
	}, [question]);

	const useHint = () => {
		const correctAnswer = question.answers.find((a) => a.isCorrect);
		const wrongAnswers = question.answers.filter((a) => !a.isCorrect);
		const randomWrongAnswer =
			wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
		setFilteredAnswers(
			[correctAnswer, randomWrongAnswer].sort(() => Math.random() - 0.5)
		);
		setUsedHint(true);
	};

	const handleAnswerClick = (index, answer) => {
		setSelectedAnswer(index);
		setShowResult(true);
		onAnswer(index);
	};

	const getAnswerStyle = (answer, index) => {
		if (!showResult || selectedAnswer !== index) {
			return 'w-full text-left px-4 py-3 rounded-lg bg-white border border-gray-200 hover:border-[#3390ec] hover:bg-[#3390ec]/5 transition-all duration-150 text-black font-normal active:bg-[#3390ec]/10 touch-manipulation transform-gpu disabled:opacity-75 disabled:cursor-not-allowed';
		}

		return `w-full text-left px-4 py-3 rounded-lg bg-white transition-all duration-150 text-black font-normal touch-manipulation transform-gpu disabled:opacity-75 disabled:cursor-not-allowed ${
			answer.isCorrect ? 'border-2 border-green-500' : 'border-2 border-red-500'
		}`;
	};

	if (!question) return null;

	const progress = (currentQuestion / totalQuestions) * 100;

	return (
		<motion.div
			className="tg-card relative"
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.15 }}>
			<div className="flex justify-between items-center mb-6">
				<div className="flex-1">
					<div className="tg-progress-bg overflow-hidden">
						<motion.div
							className="tg-progress"
							style={{ width: `${progress}%` }}
							initial={{ width: '0%' }}
							animate={{ width: `${progress}%` }}
							transition={{ duration: 0.2 }}
						/>
					</div>
					<p className="tg-counter">
						Вопрос {currentQuestion} из {totalQuestions}
					</p>
				</div>

				{!usedHint && (
					<motion.button
						onClick={useHint}
						className="ml-4 px-3 py-1.5 rounded-lg bg-[#3390ec]/10 text-[#3390ec]
                     font-medium text-sm hover:bg-[#3390ec]/20 active:bg-[#3390ec]/30
                     flex items-center justify-center min-w-[70px] touch-manipulation"
						whileTap={{ scale: 0.95 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.15 }}>
						50/50
					</motion.button>
				)}
			</div>

			<motion.h2
				className="tg-question"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.15 }}>
				{question.text}
			</motion.h2>

			<div className="space-y-2">
				<AnimatePresence mode="wait">
					{(usedHint ? filteredAnswers : question.answers).map((answer, index) => {
						const actualIndex = usedHint
							? question.answers.findIndex((a) => a.text === answer.text)
							: index;

						return (
							<motion.button
								key={`${currentQuestion}-${index}`}
								onClick={() => handleAnswerClick(actualIndex, answer)}
								className={getAnswerStyle(answer, actualIndex)}
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								transition={{
									duration: 0.15,
									delay: index * 0.05,
								}}
								whileTap={{ scale: 0.98 }}
								disabled={showResult}>
								{answer.text}
							</motion.button>
						);
					})}
				</AnimatePresence>
			</div>

			<motion.div
				className="mt-4 text-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.15 }}>
				<motion.span
					className={`text-lg font-medium ${
						timeLeft <= 5 ? 'text-red-500' : 'text-[#707579]'
					}`}
					animate={
						timeLeft <= 5
							? {
									scale: [1, 1.1, 1],
									transition: { duration: 0.3, repeat: Infinity },
								}
							: {}
					}>
					⏱️ {timeLeft}
				</motion.span>
			</motion.div>
		</motion.div>
	);
}

export default memo(QuestionCard);
