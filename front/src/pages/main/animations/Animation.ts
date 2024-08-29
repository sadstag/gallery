import type { JSX, Setter } from 'solid-js'

export type AnimationId = 'none' | 'gigue'

export interface Animator {
	setup(setDirectStyle: Setter<JSX.CSSProperties>): void
	start(): void
	stop(): void
}

export type AnimatorBuilder = () => Animator
