import React, { useEffect } from 'react';
import './App.css';
import QuizApp from './components/QuizApp';

function App() {
	useEffect(() => {
		// Инициализация Telegram Web App
		const tg = window.Telegram.WebApp;
		if (tg) {
			tg.expand(); // Развернуть на весь экран
			tg.enableClosingConfirmation(); // Подтверждение закрытия
		}
	}, []);

	return (
		<div className="App">
			<QuizApp />
		</div>
	);
}

export default App;
