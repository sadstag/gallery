import { useNavigate, useParams } from '@solidjs/router'

import { Show, createEffect, createSignal, onCleanup, } from 'solid-js'
import { useArtworkImagesDBResource } from '../../context/ArtworkImagesDBProvider'
import {
    useArtwork,
} from '../../context/ArtworksDBProvider'
import { useWallModel } from '../../context/wall/WallModelProvider'
import type { ArtworkImageSize } from '../../model/ArtworkSize'
import type { ArtworkId } from '../../model/Base'
import { ArtworkInfo } from './ArtworkInfo'
import styles from './ArtworkPage.module.css'

export const ArtworkPage = () => {
    const params = useParams()

    const artworkImagesDB = useArtworkImagesDBResource()

    // biome-ignore lint/style/useConst: typescript not able to see that there is a proxy under
    let imgRef: HTMLImageElement | undefined = undefined

    const [imgURL, setImgURL] = createSignal<string | undefined>(
        artworkImagesDB?.()?.getImageURL(params.id, 'small')
    )

    const artwork = () => useArtwork(params.id)

    createEffect(() => {
        let size: ArtworkImageSize = 'small'
        if (imgRef) {
            // @ts-ignore
            size = imgRef.width > 800 || imgRef.width >= 800
                ? 'large'
                : 'medium'
        }
        setImgURL(artworkImagesDB?.()?.getImageURL(params.id, size))
    })


    const title = () => artwork()?.title ?? 'untitled'
    const description = () => artwork()?.description

    // Naivgation through artworks using wall model
    const { wallModel } = useWallModel()

    const navigate = useNavigate()

    const visitArtwork = (destId: ArtworkId) => {
        navigate(`/artwork/${destId}`)
    }

    const getArtworkId = (delta: -1 | 1) => {
        // find previous artwork
        const index = wallModel.filteredArtworks.findIndex(({ id: _id }) => _id === params.id)
        if (index === -1) {
            // not supposed to happen, but not a reason to crash
            return wallModel.filteredArtworks[0].id
        }
        return wallModel.filteredArtworks[
            // adding wallModel.filteredArtworks.length to avoid adressing index -1
            (index + delta + wallModel.filteredArtworks.length) % wallModel.filteredArtworks.length
        ].id

    }

    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
            visitArtwork(getArtworkId(-1))
        } else if (e.key === 'ArrowRight') {
            visitArtwork(getArtworkId(1))
        }
    }
    window.addEventListener('keyup', handleKeyUp)

    onCleanup(() => {
        window.removeEventListener('keyup', handleKeyUp)
    })


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
