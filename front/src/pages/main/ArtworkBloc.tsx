import styles from "./Wall.module.css";

import { useArtworksDBResource } from "../../context/ArtworksDBProvider";
import type { Artwork } from "../../model/Artwork";


type Props = {
	artwork: Artwork;
}

export function ArtworkBloc(props: Props) {
	const {
		artwork: { id, title },
	} = props;

	const artworksDB = useArtworksDBResource();

	const style = {
		'background-image': `url(${artworksDB?.()?.getImageURL(id, "small")})`,
	}

	return (
		<a href={`/artwork/${id}`}>
			<div class={styles.artwork} style={style}>
				<div class={styles.title}>{title}</div>
			</div>
		</a>
	);
}
