import type { JSX, Setter } from 'solid-js'

const constantStyle: JSX.CSSProperties = {
	'box-shadow': '0px 0px 10px 10px black',
}

export class Gigue {
	interval = 0
	strength: number
	setDirectStyle: Setter<JSX.CSSProperties> | undefined = undefined

	constructor(strength = 1) {
		this.strength = strength
	}

	setup(setDirectStyle: Setter<JSX.CSSProperties>) {
		this.setDirectStyle = setDirectStyle
		setDirectStyle(constantStyle)
	}

	start() {
		const started = Date.now()

		const delayDuration = 5000 + 10000 * Math.random()

		const angleAmplitude =
			(1 + 2 * Math.random()) *
			this.strength *
			//sign
			(Math.random() > 0.5 ? 1 : -1)
		const angleChangePeriod = ((80 / this.strength + (40 / this.strength) * Math.random()) * 1000) / this.strength

		const scaleChangeAmplitude = 0.1 * Math.random() * this.strength
		const scaleChangePeriod = ((80 / this.strength + (40 / this.strength) * Math.random()) * 1000) / this.strength

		const step = () => {
			let dt = Date.now() - started
			if (dt < delayDuration) {
				return
			}

			dt -= delayDuration // so that it begins moving at angle 0 and scale 1

			const angle = angleAmplitude * Math.sin((2 * Math.PI * dt) / angleChangePeriod)
			const scale = 1 + scaleChangeAmplitude * Math.sin((2 * Math.PI * dt) / scaleChangePeriod)

			this.setDirectStyle?.(directStyle => ({
				...directStyle,
				...constantStyle,
				transform: `scale(${scale}) rotate(${angle}deg)`,
			}))
		}

		// avoid requestAnimationFrame (too much pressure on rendering)
		// this is very slow animation anyway
		this.interval = window.setInterval(step, Math.max(50, 200 / this.strength))
	}

	stop() {
		if (this.interval) {
			window.clearInterval(this.interval)
		}
	}
}
