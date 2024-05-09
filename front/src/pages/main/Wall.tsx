import { For } from "solid-js"
import { useArtworksDB } from "../../context/ArtworksDBProvider"
import { ArtworkBloc } from "./ArtworkBloc"
import styles from './Wall.module.css'


export function Wall() {
    const artworksDB = useArtworksDB()

    const artworks = () => artworksDB?.()?.artworks ?? []

    return (
        <div class={styles.wall}>
            <For each={artworks()}>{
                (artwork) =>
                    <ArtworkBloc artwork={artwork} />
            }
            </For>
        </div>
    )
} 