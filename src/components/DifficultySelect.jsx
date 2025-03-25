import { memo } from 'react';

function DifficultySelect({ onSelect }) {
	const difficulties = [
		{
			id: 'easy',
			name: 'Легкий',
			color: 'bg-green-500',
			icon: '🌱',
			timePerQuestion: 30,
			questionsCount: 5,
			description: 'Простые вопросы, много времени на ответ',
		},
		{
			id: 'medium',
			name: 'Средний',
			color: 'bg-yellow-500',
			icon: '🌟',
			timePerQuestion: 20,
			questionsCount: 10,
			description: 'Вопросы средней сложности',
		},
		{
			id: 'hard',
			name: 'Сложный',
			color: 'bg-red-500',
			icon: '🔥',
			timePerQuestion: 15,
			questionsCount: 15,
			description: 'Сложные вопросы, меньше времени',
		},
	];

	return (
		<div className="tg-card" role="region" aria-label="Выбор уровня сложности">
			<h1 className="text-2xl font-bold text-black mb-6 text-center">
				Выберите уровень сложности
			</h1>
			<div className="space-y-4">
				{difficulties.map((diff) => (
					<button
						key={diff.id}
						onClick={() => onSelect(diff)}
						className="tg-button flex items-center justify-between group hover:scale-102 transform transition-all duration-200"
						aria-label={`${diff.name} уровень: ${diff.description}`}>
						<div className="flex items-center">
							<span className="text-2xl mr-3" role="img" aria-hidden="true">
								{diff.icon}
							</span>
							<div>
								<span className="font-medium text-black block">{diff.name}</span>
								<span className="text-sm text-[#707579]">
									{diff.questionsCount} вопросов • {diff.timePerQuestion} сек
								</span>
							</div>
						</div>
						<div className={`w-2 h-2 rounded-full ${diff.color}`} aria-hidden="true" />
					</button>
				))}
			</div>
		</div>
	);
}

export default memo(DifficultySelect);
