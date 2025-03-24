const requiredEnvVars = [
	'REACT_APP_BOT_TOKEN',
	'REACT_APP_BOT_USERNAME',
	'REACT_APP_WEB_APP_URL',
	'REACT_APP_API_URL',
];

// Проверяем наличие всех необходимых переменных окружения
requiredEnvVars.forEach((varName) => {
	if (!process.env[varName]) {
		throw new Error(`Missing required environment variable: ${varName}`);
	}
});

export const APP_CONFIG = {
	botToken: process.env.REACT_APP_BOT_TOKEN,
	botUsername: process.env.REACT_APP_BOT_USERNAME,
	webAppUrl: process.env.REACT_APP_WEB_APP_URL,
	apiUrl: `${process.env.REACT_APP_API_URL}/questions`,
	isDevelopment: process.env.REACT_APP_ENV === 'development',
};

// Предотвращаем случайное изменение конфигурации
Object.freeze(APP_CONFIG);
