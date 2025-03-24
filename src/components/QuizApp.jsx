import WebApp from '@twa-dev/sdk';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { APP_CONFIG } from '../constants';
import DetailedResult from './DetailedResult';
import DifficultySelect from './DifficultySelect';
import QuestionCard from './QuestionCard';
import StatusBar from './StatusBar';

// Создаем звуки через Web Audio API
const createSound = (type) => {
	const audioContext = new (window.AudioContext || window.webkitAudioContext)();
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	switch (type) {
		case 'correct':
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
			gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);
			oscillator.start();
			oscillator.stop(audioContext.currentTime + 0.15);
			break;
		case 'incorrect':
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
			gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);
			oscillator.start();
			oscillator.stop(audioContext.currentTime + 0.15);
			break;
		case 'timeout':
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
			gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);
			oscillator.start();
			oscillator.stop(audioContext.currentTime + 0.3);
			break;
	}
};

// Добавим мемоизацию для предотвращения лишних ререндеров
const MemoizedStatusBar = React.memo(StatusBar);
const MemoizedQuestionCard = React.memo(QuestionCard);
const MemoizedDetailedResult = React.memo(DetailedResult);
const MemoizedDifficultySelect = React.memo(DifficultySelect);

function QuizApp() {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [questions, setQuestions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [difficulty, setDifficulty] = useState(null);
	const [answers, setAnswers] = useState([]);
	const [timeLeft, setTimeLeft] = useState(30);
	const [gameStarted, setGameStarted] = useState(false);

	// Используем useRef для хранения таймера
	const timerRef = useRef(null);

	// Очистка таймера при размонтировании
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, []);

	useEffect(() => {
		try {
			WebApp.ready();
			WebApp.expand();

			const handleBackButton = () => {
				if (difficulty) {
					handleRestart();
					return true;
				}
				return false;
			};

			WebApp.onEvent('backButtonClicked', handleBackButton);

			return () => {
				WebApp.offEvent('backButtonClicked', handleBackButton);
			};
		} catch (e) {
			console.error('Error initializing Telegram Web App:', e);
		}
	}, [difficulty]);

	useEffect(() => {
		if (gameStarted && timeLeft > 0) {
			// Очищаем предыдущий таймер перед установкой нового
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}

			timerRef.current = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);

			return () => {
				if (timerRef.current) {
					clearInterval(timerRef.current);
				}
			};
		} else if (timeLeft === 0 && gameStarted) {
			handleTimeout();
		}
	}, [timeLeft, gameStarted]);

	const shuffleArray = (array) => {
		const shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	};

	const fetchQuestions = async (diff) => {
		try {
			setLoading(true);
			const { data } = await axios.get(`${APP_CONFIG.apiUrl}`, {
				headers: {
					'Content-Type': 'application/json',
				},
				mode: 'cors',
			});

			if (!Array.isArray(data)) {
				throw new Error('Неверный формат данных');
			}

			const validData = data.every(
				(q) =>
					q &&
					typeof q.text === 'string' &&
					Array.isArray(q.answers) &&
					q.answers.every(
						(a) => typeof a.text === 'string' && typeof a.isCorrect === 'boolean'
					)
			);

			if (!validData) {
				throw new Error('Неверная структура данных вопросов');
			}

			// Проверяем, достаточно ли вопросов
			if (data.length < diff.questionsCount) {
				throw new Error(
					`Недостаточно вопросов. Требуется: ${diff.questionsCount}, доступно: ${data.length}`
				);
			}

			const shuffledQuestions = shuffleArray(data)
				.slice(0, diff.questionsCount)
				.map((question) => ({
					...question,
					answers: shuffleArray(question.answers),
				}));

			setQuestions(shuffledQuestions);
			setGameStarted(true);
			setTimeLeft(diff.timePerQuestion);
		} catch (err) {
			setError(`Ошибка при загрузке вопросов: ${err.message}`);
			console.error('Error fetching questions:', err);
		} finally {
			setLoading(false);
		}
	};

	const handleDifficultySelect = (diff) => {
		if (!diff) {
			setError('Некорректный уровень сложности');
			return;
		}
		setDifficulty(diff);
		fetchQuestions(diff);
	};

	const playSound = useCallback((type) => {
		try {
			createSound(type);
		} catch (e) {
			console.error('Error playing sound:', e);
		}
	}, []);

	const handleAnswer = (selectedIndex) => {
		if (!difficulty || !questions[currentQuestion]) {
			console.error('Некорректное состояние игры');
			return;
		}

		const isCorrect =
			selectedIndex === -1
				? false
				: questions[currentQuestion].answers[selectedIndex].isCorrect;

		playSound(isCorrect ? 'correct' : 'incorrect');

		setAnswers((prev) => [...prev, { selectedIndex, isCorrect }]);

		if (currentQuestion + 1 < questions.length) {
			setCurrentQuestion((prev) => prev + 1);
			setTimeLeft(difficulty.timePerQuestion);
		} else {
			setGameStarted(false);
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
			WebApp.sendData(
				JSON.stringify({
					difficulty: difficulty.id,
					score: answers.filter((a) => a.isCorrect).length,
					total: questions.length,
					timePerQuestion: difficulty.timePerQuestion,
				})
			);
		}
	};

	const handleTimeout = () => {
		if (!difficulty) {
			console.error('Некорректное состояние игры');
			return;
		}

		playSound('timeout');
		setAnswers((prev) => [...prev, { selectedIndex: -1, isCorrect: false }]);

		if (currentQuestion + 1 < questions.length) {
			setCurrentQuestion((prev) => prev + 1);
			setTimeLeft(difficulty.timePerQuestion);
		} else {
			setGameStarted(false);
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
			WebApp.sendData(
				JSON.stringify({
					difficulty: difficulty.id,
					score: answers.filter((a) => a.isCorrect).length,
					total: questions.length,
					timePerQuestion: difficulty.timePerQuestion,
				})
			);
		}
	};

	const handleRestart = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		setCurrentQuestion(0);
		setAnswers([]);
		setDifficulty(null);
		setGameStarted(false);
		setTimeLeft(0); // Сбрасываем в 0, так как новое значение будет установлено при выборе сложности
		setQuestions([]); // Очищаем вопросы
	};

	// Оптимизируем вычисления статистики
	const stats = useMemo(
		() => ({
			correct: answers.filter((a) => a.isCorrect).length,
			incorrect: answers.filter((a) => !a.isCorrect).length,
		}),
		[answers]
	);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 py-8 px-4" role="status" aria-busy="true">
				<div className="tg-card flex items-center justify-center">
					<div className="animate-pulse flex flex-col items-center">
						<div
							className="w-12 h-12 border-4 border-[#3390ec] border-t-transparent rounded-full animate-spin"
							aria-label="Загрузка"
						/>
						<p className="mt-4 tg-loading">Загрузка вопросов...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-100 py-8 px-4" role="alert">
				<div className="tg-card">
					<div className="text-center">
						<span className="text-4xl mb-4 block" role="img" aria-label="Ошибка">
							⚠️
						</span>
						<h2 className="text-xl font-medium text-black mb-2">Произошла ошибка</h2>
						<p className="text-[#707579] font-medium mb-6">{error}</p>
						<button
							onClick={() => {
								setError(null);
								fetchQuestions(difficulty);
							}}
							className="tg-button text-center bg-[#3390ec] text-white hover:bg-[#3390ec]/90 font-medium"
							aria-label="Попробовать загрузить вопросы снова">
							Попробовать снова
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-100 py-8 px-4">
			<main>
				{gameStarted && questions.length > 0 && (
					<MemoizedStatusBar
						correct={stats.correct}
						incorrect={stats.incorrect}
						timeLeft={timeLeft}
					/>
				)}

				<div className="max-w-md mx-auto mt-20">
					{!difficulty ? (
						<MemoizedDifficultySelect onSelect={handleDifficultySelect} />
					) : !gameStarted && answers.length === questions.length ? (
						<MemoizedDetailedResult
							answers={answers}
							questions={questions}
							onRestart={handleRestart}
						/>
					) : questions.length > 0 ? (
						<MemoizedQuestionCard
							question={questions[currentQuestion]}
							currentQuestion={currentQuestion + 1}
							totalQuestions={questions.length}
							onAnswer={handleAnswer}
							timeLeft={timeLeft}
						/>
					) : null}
				</div>
			</main>
		</div>
	);
}

export default React.memo(QuizApp);
