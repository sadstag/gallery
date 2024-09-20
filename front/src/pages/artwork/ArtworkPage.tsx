import { useNavigate, useParams } from '@solidjs/router'
import { Show, createEffect, createMemo, createSignal, onCleanup, } from 'solid-js'
import { SolidMarkdown } from "solid-markdown";
import { useArtworkImagesDBResource } from '../../context/ArtworkImagesDBProvider'
import {
    useArtwork,
} from '../../context/ArtworksDBProvider'
import { useWallModel } from '../../context/wall/WallModelProvider'
import { Link } from '../../design-system/Link/Link';
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

    const artwork = createMemo(() => useArtwork(params.id))

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

    // Naivgation through artworks using wall model
    const { wallModel } = useWallModel()

    const navigate = useNavigate()

    const visitArtwork = (destId: ArtworkId) => {
        navigate(`/artwork/${destId}`, { replace: true })
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
    const handleKeyDown = (e: KeyboardEvent) => {
        // keydown allow event repetition fired at high rate, so that we can rapidly browse the collection
        switch (e.key) {
            case 'ArrowLeft': visitArtwork(getArtworkId(-1)); break
            case 'ArrowRight': visitArtwork(getArtworkId(1)); break
            case 'Escape': // no break
            case 'ArrowUp': // no break
            case 'ArrowDown': navigate('/'); break
        }

    }

    window.addEventListener('keydown', handleKeyDown)

    onCleanup(() => {
        window.removeEventListener('keydown', handleKeyDown)
    })

    const title = () => artwork()?.title ?? 'untitled'
    const subtitle = () => artwork()?.subtitle
    const description = () => artwork()?.description ?? ""


    return (
        <article class={styles.page}>
            <div class={styles.image} ref={imgRef} style={{
                'background-image': `url(${imgURL() || 'TODO url "??'})`,
            }}>
            </div>
            <Show when={artwork()}>
                <div class={styles['info-panel']}>
                    <h1>{title()}</h1>
                    <Show when={subtitle()}>
                        <h2>{subtitle()}</h2>
                    </Show>
                    <Show when={description()}>
                        <SolidMarkdown
                            class={styles.presentation}
                            components={{
                                a: (props) => <Link discrete={true} href={props.href}>{props.children}</Link>
                            }}>
                            {description()}
                        </SolidMarkdown>
                    </Show>
                    <ArtworkInfo artwork={artwork} />
                </div>
            </Show>
        </article>
    )
}
