import { For, } from "solid-js";
import { useArtworksDBResource } from "../../context/ArtworksDBProvider";
import { ArtworkBloc } from "./ArtworkBloc";
import styles from "./Wall.module.css";
import { AppliedFiltersPanel } from "./appliedFilterPanel/AppliedFiltersPanel";

window.history.scrollRestoration = "manual";

export function Wall() {
	const artworksDB = useArtworksDBResource()

	return (
		<>
			<AppliedFiltersPanel />
			<div class={styles.wall}>
				<For each={artworksDB?.()?.artworks ?? []}>
					{artwork => <ArtworkBloc artwork={artwork} />}
				</For>
			</div>
		</>
	);
}
