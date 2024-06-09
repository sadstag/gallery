import { useParams } from '@solidjs/router'

import styles from './ArtworkPage.module.css'
import { Show, createRenderEffect, createSignal } from 'solid-js'
import {
    useArtwork,
    useArtworksDBResource
} from '../../context/ArtworksDBProvider'
import { ArtworkInfo } from './ArtworkInfo'

export const ArtworkPage = () => {
    const { id } = useParams()

    const artworksDB = useArtworksDBResource()

    let [imgRef, setImgRef] = createSignal<HTMLImageElement>()
    let [imgURL, setImgURL] = createSignal<string | undefined>(
        artworksDB?.()?.getImageURL(id, 'small')
    )

    const artwork = () => useArtwork(id)

    createRenderEffect(() => {
        // todo use onMount here ?
        const ref = imgRef()
        const size = !ref
            ? 'small' // image already loaded
            : ref.width <= 800
            ? 'medium'
            : 'large'
        return setImgURL(artworksDB?.()?.getImageURL(id, size))
    })

    const handleTouchStart = (e: TouchEvent) => {
        console.log(e)
    }
    const handleTouchMove = (e: TouchEvent) => {
        console.log(e)
    }
    const handleTouchEnd = (e: TouchEvent) => {
        console.log(e)
    }

    return (
        <article class={styles.page}>
            <img
                src={imgURL() || 'TODO url "??'}
                ref={setImgRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            />
            <Show when={artwork()}>
                <div class={styles.info}>
                    <h1>{artwork().title ?? 'Untitled'}</h1>
                    <Show when={artwork().description}>
                        <p>{artwork().description}</p>
                    </Show>
                    <ArtworkInfo artwork={artwork()} />
                </div>
            </Show>
        </article>
    )
}
