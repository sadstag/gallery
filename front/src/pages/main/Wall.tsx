import { useBeforeLeave, useLocation } from "@solidjs/router";
import { For, createEffect } from "solid-js";
import { useArtworksDBResource } from "../../context/ArtworksDBProvider";
import { ArtworkBloc } from "./ArtworkBloc";
import styles from "./Wall.module.css";

window.history.scrollRestoration = "manual";

export function Wall() {
	const artworksDB = useArtworksDBResource()

	const location = useLocation<{ scrollPosition: number }>()

	createEffect(() => {
		window.scroll(0, location.state?.scrollPosition ?? 0)
	})

	useBeforeLeave(() => {
		window.history.replaceState({ scrollPosition: window.scrollY }, "")
	})

	return (
		<div class={styles.wall}>
			<For each={artworksDB?.()?.artworks ?? []}>
				{artwork => <ArtworkBloc artwork={artwork} />}
			</For>
		</div>
	);
}
