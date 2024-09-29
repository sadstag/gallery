import { type Accessor, onCleanup } from 'solid-js'
import type { Actions } from './actions'
import { finishMovement } from './transition'

export const useNavigationWithKeyboard = (
	actions: Actions,
	swipeFeedbackElementRef: Accessor<HTMLElement | undefined>,
) => {
	const handleKeyDown = (e: KeyboardEvent) => {
		const ref = swipeFeedbackElementRef()
		if (!ref) {
			return
		}

		// keydown allow event repetition fired at high rate, so that we can rapidly browse the collection
		switch (e.key) {
			case 'ArrowLeft':
				finishMovement(ref, '100%', actions.left)
				break
			case 'ArrowRight':
				finishMovement(ref, '-100%', actions.right)
				break
			case 'Escape': // no break
			case 'ArrowUp':
				actions.top()
				break
		}
	}

	window.addEventListener('keydown', handleKeyDown)

	onCleanup(() => {
		window.removeEventListener('keydown', handleKeyDown)
	})
}
