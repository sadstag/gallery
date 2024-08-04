import styles from "./Wall.module.css";

import { useArtworkImage, useArtworkImagesDBResource, } from "../../context/ArtworkImagesDBProvider";
import type { Artwork } from "../../model/Artwork";


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

	const style = {
		'background-image': `url(${artworkImagesDB?.()?.getImageURL(id, "small")})`,
		'aspect-ratio': aspectRatio
	}

	return (
		<a href={`/artwork/${id}`}>
			<div class={styles.artwork} style={style}>
				<div class={styles.title}>{title}</div>
			</div>
		</a>
	);
}
