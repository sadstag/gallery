

import { useArtworkImage, useArtworkImagesDBResource, } from "../../context/ArtworkImagesDBProvider";
import type { Artwork } from "../../model/Artwork";
import styles from './Wall.module.css'

type Props = {
	artwork: Artwork;
}

export function ArtworkBloc(props: Props) {
	const {
		artwork: { id, title },
	} = props;

	const artworkImagesDB = useArtworkImagesDBResource();

	const { width = 1, height = 1 } = useArtworkImage(id, 'small') || {}
	const aspectRatio = width / height

	return (
		<a href={`/artwork/${id}`}>
			<img
				class={styles.artwork}
				src={artworkImagesDB?.()?.getImageURL(id, "small")}
				alt={title} style={{ 'aspect-ratio': aspectRatio }} />
		</a>
	);
}
