# Telegram Quiz Web App

Веб-приложение для проведения викторин в Telegram.

## Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/your-username/tg_web_app_react.git
cd tg_web_app_react
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env` в корневой директории проекта и добавьте следующие переменные:

```
REACT_APP_BOT_TOKEN=your_bot_token_here
REACT_APP_BOT_USERNAME=your_bot_username_here
REACT_APP_WEB_APP_URL=https://your-domain.com
```

## Настройка окружения

1. Скопируйте файл `.env.example` в `.env`:

```bash
cp .env.example .env
```

2. Заполните все необходимые переменные окружения в файле `.env`:

- `REACT_APP_BOT_TOKEN`: Токен вашего Telegram бота (получите у @BotFather)
- `REACT_APP_BOT_USERNAME`: Имя пользователя вашего бота без символа '@'
- `REACT_APP_WEB_APP_URL`: URL, где размещено ваше веб-приложение
- `REACT_APP_API_URL`: URL вашего API
- `REACT_APP_ENV`: Окружение (`development` или `production`)

⚠️ ВАЖНО:

- Никогда не коммитьте файл `.env` в репозиторий
- Не включайте реальные токены и ключи в публичный код
- Храните резервную копию ваших ключей в безопасном месте
- Регулярно меняйте токены и ключи для безопасности

## Разработка

Запустите приложение в режиме разработки:

```bash
npm start
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

## Сборка для продакшена

Для создания продакшен-сборки выполните:

```bash
npm run build
```

Собранное приложение будет находиться в директории `build`.

## Интеграция с Telegram

1. Создайте бота через [@BotFather](https://t.me/botfather)
2. Получите токен бота
3. Создайте веб-приложение для бота через [@BotFather](https://t.me/botfather)
4. Укажите URL вашего приложения в настройках веб-приложения
5. Добавьте кнопку для запуска веб-приложения в меню бота

## Технологии

- React
- Material-UI
- Telegram Web App SDK
- Create React App

# Security

.env*
!.env.example
*.pem
_.key
_.cert
