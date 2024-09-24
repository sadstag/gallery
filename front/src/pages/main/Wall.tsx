import { useWallModel } from '@context/wall/WallModelProvider'
import { For } from 'solid-js'
import { ArtworkBloc } from './ArtworkBloc'
import styles from './Wall.module.css'
import { WallViewport } from './WallViewport'
import { SortPanel } from './wallParameters/SortPanel'
import { AppliedFiltersPanel } from './wallParameters/filters/AppliedFiltersPanel'

export function Wall() {
	const { wallModel } = useWallModel()

	return (
		<div class={styles.container}>
			<div class={styles.header}>
				<AppliedFiltersPanel />
				<SortPanel />
			</div>
			<WallViewport>
				<div class={styles.wall}>
					<For each={wallModel.filteredArtworks}>{artwork => <ArtworkBloc artwork={artwork} />}</For>
				</div>
			</WallViewport>
			<div class={styles.footer} />
		</div>
	)
}
