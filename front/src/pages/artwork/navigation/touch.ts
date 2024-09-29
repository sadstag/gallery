import { type Accessor, onCleanup } from 'solid-js'
import type { ActionType, Actions } from './actions'
import { finishMovement } from './transition'

const ANGLE_TOP = -90
const ANGLE_RIGHT = 0
const ANGLE_LEFT = 180

type Direction = ActionType | 'none'

// tuning
const DEFAULT_TOLERANCE_ANGLE = 30 // degrees
const DEFAULT_MIN_SWIPE_DISTANCE = 30 // px, at deviceratio = 1 (96dpi)

function getSwipeDirection(
	deltaX: number,
	deltaY: number,
	toleranceAngle = DEFAULT_TOLERANCE_ANGLE,
	// distance should be given in real world unit
	// but we can't know the real device DPI
	// so we fallback to this approximation : nb pixels times deviceRatio (which is just an indication)
	minSwipeDistance = DEFAULT_MIN_SWIPE_DISTANCE,
): Direction {
	if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) < minSwipeDistance * window.devicePixelRatio) {
		return 'none'
	}

	const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI // between -180 and 180

	if (Math.abs(angle - ANGLE_TOP) <= toleranceAngle) {
		return 'top'
	}
	if (Math.abs(angle - ANGLE_RIGHT) <= toleranceAngle) {
		return 'right'
	}
	if (Math.abs(angle - ANGLE_LEFT) <= toleranceAngle || Math.abs(360 + angle - ANGLE_LEFT) <= toleranceAngle) {
		return 'left'
	}
	return 'none'
}

export const useNavigationWithTouch = (
	actions: Actions,
	swipeFeedbackElementRef: Accessor<HTMLElement | undefined>,
) => {
	let touchStartX: number
	let touchStartY: number

	const handleTouchStart = ({ touches: [{ clientX, clientY }] }: TouchEvent) => {
		touchStartX = clientX
		touchStartY = clientY
	}

	const handleTouchMove = (e: TouchEvent) => {
		const ref = swipeFeedbackElementRef()
		if (!ref) {
			return
		}
		const {
			changedTouches: [{ clientX }],
		} = e
		const deltaX = clientX - touchStartX

		// resistance
		const translationX = Math.sign(deltaX) * Math.abs(deltaX) ** 0.8

		ref.style.transform = `translate(${translationX}px, 0px)`
	}

	const handleTouchEnd = ({ changedTouches: [{ clientX, clientY }] }: TouchEvent) => {
		const ref = swipeFeedbackElementRef()
		if (!ref) {
			return
		}

		const deltaX = clientX - touchStartX
		const deltaY = clientY - touchStartY

		const direction = getSwipeDirection(deltaX, deltaY)
		if (direction === 'none') {
			ref.style.transform = 'translate(0,0)'
			return
		}

		switch (direction) {
			case 'right':
				finishMovement(ref, '100%', actions.right)
				break
			case 'left': {
				finishMovement(ref, '-100%', actions.left)
				break
			}
			case 'top':
				actions.top()
		}
	}

	window.addEventListener('touchstart', handleTouchStart)
	window.addEventListener('touchmove', handleTouchMove)
	window.addEventListener('touchend', handleTouchEnd)

	onCleanup(() => {
		window.removeEventListener('touchstart', handleTouchStart)
		window.removeEventListener('touchmove', handleTouchMove)
		window.removeEventListener('touchend', handleTouchEnd)
	})
}
