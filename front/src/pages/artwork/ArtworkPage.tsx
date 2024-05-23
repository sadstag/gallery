import { useParams } from '@solidjs/router'

import styles from './ArtworkPage.module.css'
import { Show, createRenderEffect, createSignal } from 'solid-js'
import { useArtwork } from '../../context/ArtworksDBProvider'
import { ArtworkInfo } from './ArtworkInfo'

const makeImgURL = (id: string, size: string): string =>
    `/artworks/images/${size}/${id}.webp`

export const ArtworkPage = () => {
    const { id } = useParams()

    let [imgRef, setImgRef] = createSignal<HTMLImageElement>()
    let [imgURL, setImgURL] = createSignal<string>(makeImgURL(id, 'small'))

    const artwork = () => useArtwork(id)

    createRenderEffect(() => {
        // todo use onMount here ?
        const ref = imgRef()
        const size = !ref
            ? 'small' // image already loaded
            : ref.width <= 800
            ? 'medium'
            : 'large'
        return setImgURL(makeImgURL(id, size))
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
                src={imgURL()}
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
