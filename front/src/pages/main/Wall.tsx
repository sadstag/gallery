import { For, } from "solid-js";
import { useArtworks, } from "../../context/ArtworksDBProvider";
import { useWallModel } from "../../context/WallModelProvider";
import { } from "../../model/wall/Sort";
import { applyFilters } from "../../model/wall/filterFunctions";
import { applySort, } from "../../model/wall/sortFunctions";
import { ArtworkBloc } from "./ArtworkBloc";
import styles from "./Wall.module.css";
import { SortPanel } from "./wallParameters/SortPanel";
import { AppliedFiltersPanel } from "./wallParameters/filters/AppliedFiltersPanel";

window.history.scrollRestoration = "manual";

export function Wall() {
	const artworks = useArtworks()

	const [{ appliedFilters, sort }] = useWallModel()

	const filteredArtworks = () => {
		const filtered = applyFilters(appliedFilters, Object.values(artworks))
		applySort(sort, filtered)
		console.log('compute', { db: Object.values(artworks), filtered })
		return filtered
	}

	return (
		<>
			<div class={styles['wall-header']}>
				<div>Displaying {filteredArtworks().length}/{artworks.length} artworks</div>
				<SortPanel />
				<AppliedFiltersPanel />
			</div>
			<div class={styles.wall}>
				<For each={filteredArtworks()}>
					{artwork => <ArtworkBloc artwork={artwork} />}
				</For>
			</div>
		</>
	);
}
