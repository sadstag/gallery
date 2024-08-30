import { type JSX, type Setter, onCleanup, onMount } from 'solid-js'
import { getAnimator } from '.'
import { useSetting } from '../../../context/SettingsProvider'
import type { AnimationId } from './Animation'

export const useAnimation = (setDirectStyle: Setter<JSX.CSSProperties>) => {
	const animationId = useSetting('artworksWallAnimation') as AnimationId

	if (animationId !== 'none') {
		const animation = getAnimator(animationId)

		const handleUserFeltAsleep = () => {
			animation?.start()
		}
		const handleUserAwoke = () => {
			animation?.stop()
			animation?.reset()
		}
		onMount(() => {
			animation?.setup(setDirectStyle)
			window.addEventListener('user_felt_asleep', handleUserFeltAsleep)
			window.addEventListener('user_awoke', handleUserAwoke)
		})
		onCleanup(() => {
			window.removeEventListener('user_felt_asleep', handleUserFeltAsleep)
			window.removeEventListener('user_awoke', handleUserAwoke)

			animation?.stop()
		})
	}
}
