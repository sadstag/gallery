import { useParams } from '@solidjs/router'

import { Show, createRenderEffect, createSignal } from 'solid-js'
import { useArtworkImagesDBResource } from '../../context/ArtworkImagesDBProvider'
import {
    useArtwork,
} from '../../context/ArtworksDBProvider'
import { ArtworkInfo } from './ArtworkInfo'
import styles from './ArtworkPage.module.css'

export const ArtworkPage = () => {
    const { id } = useParams()

    const artworkImagesDB = useArtworkImagesDBResource()

    const [imgRef, setImgRef] = createSignal<HTMLImageElement>()
    const [imgURL, setImgURL] = createSignal<string | undefined>(
        artworkImagesDB?.()?.getImageURL(id, 'small')
    )

    const artwork = () => useArtwork(id)

    createRenderEffect(() => {
        // todo use onMount here ?
        const ref = imgRef()
        const size = ref
            ? ref.width <= 800
                ? 'medium'
                : 'large' : 'small'
        return setImgURL(artworkImagesDB?.()?.getImageURL(id, size))
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
                alt="todo alt"
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
