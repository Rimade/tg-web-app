function StatusBar({ correct, incorrect, timeLeft }) {
	return (
		<div className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-100 p-2">
			<div className="max-w-md mx-auto flex justify-between items-center">
				<div className="flex space-x-6">
					<div className="flex items-center">
						<span className="text-green-500 text-xl mr-1.5">✓</span>
						<span className="font-medium text-black">{correct}</span>
					</div>
					<div className="flex items-center">
						<span className="text-red-500 text-xl mr-1.5">✗</span>
						<span className="font-medium text-black">{incorrect}</span>
					</div>
				</div>
				<div className="flex items-center">
					<span className="text-[#3390ec] text-lg mr-1.5">⏱️</span>
					<span
						className={`font-medium ${timeLeft <= 5 ? 'text-red-500' : 'text-black'}`}>
						{timeLeft}
					</span>
				</div>
			</div>
		</div>
	);
}

export default StatusBar;
