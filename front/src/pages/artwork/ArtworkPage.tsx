import { useParams } from '@solidjs/router'

import { Show, createSignal, onMount } from 'solid-js'
import { useArtworkImagesDBResource } from '../../context/ArtworkImagesDBProvider'
import {
    useArtwork,
} from '../../context/ArtworksDBProvider'
import type { ArtworkImageSize } from '../../model/ArtworkSize'
import { ArtworkInfo } from './ArtworkInfo'
import styles from './ArtworkPage.module.css'

export const ArtworkPage = () => {
    const { id } = useParams()

    const artworkImagesDB = useArtworkImagesDBResource()

    // biome-ignore lint/style/useConst: typescript not able to see that there is a proxy under
    let imgRef: HTMLImageElement | undefined = undefined

    const [imgURL, setImgURL] = createSignal<string | undefined>(
        artworkImagesDB?.()?.getImageURL(id, 'small')
    )

    const artwork = () => useArtwork(id)

    onMount(() => {
        let size: ArtworkImageSize = 'small'
        if (imgRef) {
            // @ts-ignore
            size = imgRef.width > 800 || imgRef.width >= 800
                ? 'large'
                : 'medium'
        }
        return setImgURL(artworkImagesDB?.()?.getImageURL(id, size))

    })

    const title = () => artwork()?.title ?? 'untitled'
    const description = () => artwork()?.description

    return (
        <article class={styles.page}>
            <div class={styles.image} ref={imgRef} style={{
                'background-image': `url(${imgURL() || 'TODO url "??'})`,
            }}>
            </div>
            <Show when={artwork()}>
                <div class={styles['info-panel']}>
                    <h1>{title()}</h1>
                    <Show when={description()}>
                        <p>{description()}</p>
                    </Show>
                    <ArtworkInfo artwork={artwork()} />
                </div>
            </Show>
        </article>
    )
}
