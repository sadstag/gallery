import { For, createMemo, onCleanup, } from "solid-js";
import { useArtworks, } from "../../context/ArtworksDBProvider";
import { useSetting } from "../../context/SettingsProvider";
import { useWallModel } from "../../context/wall/WallModelProvider";
import { } from "../../model/wall/Sort";
import { ArtworkBloc } from "./ArtworkBloc";
import styles from "./Wall.module.css";
import { SortPanel } from "./wallParameters/SortPanel";
import { AppliedFiltersPanel } from "./wallParameters/filters/AppliedFiltersPanel";

window.history.scrollRestoration = "manual";

export function Wall() {
	const artworks = useArtworks()

	const startIdleAnimationDelayStr = useSetting('startIdleAnimationDelay')
	const startIdleAnimationDelay = createMemo(() => Number.parseInt(startIdleAnimationDelayStr, 10))

	const { wallModel } = useWallModel()

	let timer: number | undefined

	// TODO look at scroll event too

	const setTimer = () => {
		timer = window.setTimeout(() => {
			timer = undefined
			window.dispatchEvent(new Event("user_felt_asleep"))
		}, startIdleAnimationDelay())
	}
	const handleMouseMove = () => {
		if (timer) {
			window.clearTimeout(timer)
		} else {
			window.dispatchEvent(new Event("user_awoke"))
		}
		setTimer()
	}

	window.addEventListener('mousemove', handleMouseMove)

	onCleanup(() => {
		window.removeEventListener('mousemove', handleMouseMove)
		window.clearTimeout(timer)
	})

	setTimer() // so that just loading the wall will get the animation to start after idle period

	return (
		<>
			<div class={styles['wall-header']}>
				<div>Displaying {wallModel.filteredArtworks.length}/{artworks.length} artworks</div>
				<SortPanel />
				<AppliedFiltersPanel />
			</div>
			<div class={styles.wall}>
				<For each={wallModel.filteredArtworks}>
					{artwork => <ArtworkBloc artwork={artwork} />}
				</For>
			</div>
		</>
	);
}
