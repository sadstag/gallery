import { For } from "solid-js";
import { useArtworks, } from "../../context/ArtworksDBProvider";
import { useWallModel } from "../../context/wall/WallModelProvider";
import { ArtworkBloc } from "./ArtworkBloc";
import { UserActivityObserver } from "./UserActivityObserver";
import styles from "./Wall.module.css";
import { SortPanel } from "./wallParameters/SortPanel";
import { AppliedFiltersPanel } from "./wallParameters/filters/AppliedFiltersPanel";

export function Wall() {
	const artworks = useArtworks()
	const { wallModel } = useWallModel()

	return (
		<UserActivityObserver>
			<div class={styles.header}>
				<div>Displaying {wallModel.filteredArtworks.length}/{artworks.length} artworks</div>
				<SortPanel />
				<AppliedFiltersPanel />
			</div>
			<div class={styles.wall}>
				<For each={wallModel.filteredArtworks}>
					{artwork => <ArtworkBloc artwork={artwork} />}
				</For>
			</div >
		</UserActivityObserver>
	);
}
