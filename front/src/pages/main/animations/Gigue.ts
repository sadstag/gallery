import type { JSX, Setter } from 'solid-js'
import type { Animator } from './Animation'

const constantStyle: JSX.CSSProperties = {
	'box-shadow': '6px 4px 8px 10px var(--body-background-color)',
	transition: 'box-shadow 1s ease-in-out',
}

export class Gigue implements Animator {
	interval = 0
	strength: number
	prestartStyle: JSX.CSSProperties | undefined
	setDirectStyle: Setter<JSX.CSSProperties> | undefined = undefined

	constructor(strength = 1) {
		this.strength = strength
	}

	setup(setDirectStyle: Setter<JSX.CSSProperties>) {
		this.setDirectStyle = setDirectStyle
	}

	reset() {
		if (this.prestartStyle) {
			this.setDirectStyle?.(this.prestartStyle)
		}
		this.prestartStyle = undefined
	}

	start() {
		const started = Date.now()

		const angleAmplitude =
			(1 + 2 * Math.random()) *
			this.strength *
			//sign
			(Math.random() > 0.5 ? 1 : -1)
		const angleChangePeriod = ((40 / this.strength + (50 / this.strength) * Math.random()) * 1000) / this.strength

		const scaleChangeAmplitude = 0.1 * Math.random() * this.strength
		const scaleChangePeriod = ((40 / this.strength + (40 / this.strength) * Math.random()) * 1000) / this.strength

		const step = () => {
			const dt = Date.now() - started

			const angle = angleAmplitude * Math.sin((2 * Math.PI * dt) / angleChangePeriod)
			const scale = 1 + scaleChangeAmplitude * Math.sin((2 * Math.PI * dt) / scaleChangePeriod)

			this.setDirectStyle?.(directStyle => {
				if (!this.prestartStyle) {
					this.prestartStyle = directStyle
				}
				return {
					...directStyle,
					...constantStyle,
					transform: `scale(${scale}) rotate(${angle}deg)`,
				}
			})
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
