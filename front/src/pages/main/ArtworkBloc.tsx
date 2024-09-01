

import { type JSX, createSignal, } from "solid-js";
import { useArtworkImage, useArtworkImagesDBResource, } from "../../context/ArtworkImagesDBProvider";
import type { Artwork } from "../../model/Artwork";
import styles from './Wall.module.css'
import { useAnimation } from "./animations/useAnimation";

type Props = {
	artwork: Artwork;
}

export function ArtworkBloc(props: Props) {

	const artworkImagesDB = useArtworkImagesDBResource();

	const { width = 1, height = 1 } = useArtworkImage(props.artwork.id, 'small') || {}
	const aspectRatio = width / height

	const [directStyle, setDirectStyle] = createSignal<JSX.CSSProperties>({
		'aspect-ratio': aspectRatio
	})

	useAnimation(setDirectStyle)

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
