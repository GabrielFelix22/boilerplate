import React, { useState } from "react"

export const Counter: React.FC = () => {
	const [count, setCount] = useState(0)

	return (
		<button
			id="counter"
			type="button"
			onClick={() => setCount(count + 1)}
			className="bg-yellow-200 p-8 rounded-lg text-2xl font-bold"
		>
			{count}
		</button>
	)
}
