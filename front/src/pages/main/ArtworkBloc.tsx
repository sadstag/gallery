

import { type JSX, createSignal, onCleanup, onMount } from "solid-js";
import { useArtworkImage, useArtworkImagesDBResource, } from "../../context/ArtworkImagesDBProvider";
import { useSetting, } from "../../context/SettingsProvider";
import type { Artwork } from "../../model/Artwork";
import styles from './Wall.module.css'
import { getAnimator } from "./animations";
import type { AnimationId } from "./animations/Animation";

type Props = {
	artwork: Artwork;
}

export function ArtworkBloc(props: Props) {

	const animationId = useSetting('artworksWallAnimation') as AnimationId

	const artworkImagesDB = useArtworkImagesDBResource();

	const { width = 1, height = 1 } = useArtworkImage(props.artwork.id, 'small') || {}
	const aspectRatio = width / height

	const [directStyle, setDirectStyle] = createSignal<JSX.CSSProperties>({
		'aspect-ratio': aspectRatio
	})

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

	return (
		<a href={`/artwork/${props.artwork.id}`}>
			<img
				class={styles.artwork}
				src={artworkImagesDB?.()?.getImageURL(props.artwork.id, "small")}
				alt={props.artwork.title}
				style={directStyle()} />
		</a>
	);
}
