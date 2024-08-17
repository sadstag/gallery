// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const debounce = (fn: (...args: any[]) => any, ms = 300) => {
	let timeoutId: number
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return function (this: any, ...args: any[]) {
		clearTimeout(timeoutId)
		timeoutId = window.setTimeout(() => fn.apply(this, args), ms)
	}
}
