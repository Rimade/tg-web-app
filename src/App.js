import React, { useEffect } from 'react'
import './App.css'
const tg = window.Telegram.WebApp

const App = () => {
	useEffect(() => {
		tg.ready()
	}, [])

	const onClose = () => {
		tg.close()
	}

	return (
		<div>
			<button onClick={onClose}>Close</button>
		</div>
	)
}

export default App
