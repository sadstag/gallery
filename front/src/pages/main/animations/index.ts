import type { AnimationId } from '@model/Settings'
import type { Animator, AnimatorBuilder } from './Animation'
import { Gigue } from './Gigue'

const animators: { [Id in AnimationId]: AnimatorBuilder | undefined } = {
	none: undefined,
	gigue: () => new Gigue(),
	gigueMore: () => new Gigue(2),
}

export function getAnimator(id: AnimationId): Animator | undefined {
	return animators[id]?.()
}
