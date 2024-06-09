import { For } from 'solid-js'
import { useArtworksDBResource } from '../../context/ArtworksDBProvider'
import { ArtworkBloc } from './ArtworkBloc'
import styles from './Wall.module.css'

export function Wall() {
    const artworksDB = useArtworksDBResource()

    return (
        <div class={styles.wall}>
            <For each={artworksDB?.()?.artworks ?? []}>
                {(artwork) => {
                    return <ArtworkBloc artwork={artwork} />
                }}
            </For>
        </div>
    )
}
