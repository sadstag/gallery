import { For, } from "solid-js";
import { useArtworksDBResource } from "../../context/ArtworksDBProvider";
import { useWallModel } from "../../context/WallModelProvider";
import { } from "../../model/wall/Sort";
import { applyFilters } from "../../model/wall/filterFunctions";
import { applySort, } from "../../model/wall/sortFunctions";
import { ArtworkBloc } from "./ArtworkBloc";
import styles from "./Wall.module.css";
import { WallParameters } from "./wallParameters/WallParameters";

window.history.scrollRestoration = "manual";

export function Wall() {
	const artworksDB = useArtworksDBResource()

	const [{ appliedFilters, sort }] = useWallModel()

	const filteredArtworks = () => {
		const filtered = applyFilters(appliedFilters, artworksDB?.()?.artworks ?? [])
		applySort(sort, filtered)
		console.log('compute', { db: artworksDB?.()?.artworks, filtered })
		return filtered
	}


	return (
		<>
			<WallParameters />
			<div class={styles.wall}>
				<For each={filteredArtworks()}>
					{artwork => <ArtworkBloc artwork={artwork} />}
				</For>
			</div>
		</>
	);
}
