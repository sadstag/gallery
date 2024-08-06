import { For, } from "solid-js";
import { useArtworksDBResource } from "../../context/ArtworksDBProvider";
import { ArtworkBloc } from "./ArtworkBloc";
import styles from "./Wall.module.css";

window.history.scrollRestoration = "manual";

export function Wall() {
	const artworksDB = useArtworksDBResource()

	return (
		<div class={styles.wall}>
			<For each={artworksDB?.()?.artworks ?? []}>
				{artwork => <ArtworkBloc artwork={artwork} />}
			</For>
		</div>
	);
}
