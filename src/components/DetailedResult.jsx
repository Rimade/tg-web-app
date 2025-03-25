function DetailedResult({ answers, questions, onRestart }) {
  if (!answers?.length || !questions?.length) {
    return (
      <div className="tg-card">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2">Нет данных</h2>
          <button
            onClick={onRestart}
            className="tg-button mb-6 text-center bg-[#3390ec] text-white hover:bg-[#3390ec]/90 font-medium"
          >
            Начать заново
          </button>
        </div>
      </div>
    );
  }

  const percentage = (answers.filter(a => a.isCorrect).length / answers.length) * 100;

  return (
    <div className="tg-card">
      <div className="text-center mb-4">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="56"
              cx="64"
              cy="64"
            />
            <circle
              className={`${percentage >= 70 ? 'text-green-500' : percentage >= 40 ? 'text-yellow-500' : 'text-red-500'}`}
              strokeWidth="8"
              strokeDasharray={352}
              strokeDashoffset={352 - (percentage / 100) * 352}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="56"
              cx="64"
              cy="64"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-black">{Math.round(percentage)}%</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-black mb-2">Ваш результат</h2>
        <p className="text-[#707579] font-medium">
          Правильных ответов: {answers.filter(a => a.isCorrect).length} из {answers.length}
        </p>
      </div>

      <button
        onClick={onRestart}
        className="tg-button mb-6 text-center bg-[#3390ec] text-white hover:bg-[#3390ec]/90 font-medium"
      >
        Пройти тест заново
      </button>

      <div className="space-y-4">
        {answers.map((answer, index) => {
          const question = questions[index];
          if (!question) return null;

          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                answer.isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}
            >
              <p className="font-medium text-black mb-2">{question.text}</p>
              <div className="flex justify-between text-sm">
                <span className="text-[#707579] font-medium">
                  {answer.selectedIndex === -1
                    ? 'Время истекло'
                    : question.answers[answer.selectedIndex]
                      ? `Ваш ответ: ${question.answers[answer.selectedIndex].text}`
                      : 'Ответ не выбран'}
                </span>
                {!answer.isCorrect && question.answers && (
                  <span className="text-green-600 font-medium">
                    Правильный: {question.answers.find(a => a.isCorrect)?.text || 'Не найден'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DetailedResult;
