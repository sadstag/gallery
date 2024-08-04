import {
    type ParentProps,
    type Resource,
    createContext,
    createResource,
    useContext
} from 'solid-js'
import type { ArtworkImage } from '../model/ArtworkImage'
import type { ArtworkSize } from '../model/ArtworkSize'

type ArtworkImages = {
    [rtworkId: string]: {
        [Size in ArtworkSize]: ArtworkImage
    }
}
type ArtworkImagesDB = {
    meta?: {
        generated: string
    }
    bucketName: string
    images: ArtworkImages
    // added by context
    getImageURL: (id: string, size: string) => string
}

const ArtworkImagessDBContext = createContext<Resource<ArtworkImagesDB>>()

export function ArtworkImagesDBProvider(props: ParentProps) {
    const [artworks] = createResource<ArtworkImagesDB>(async function f() {
        const response = await fetch('/artwork_images.json')

        if (!response.ok) {
            throw Error('ERR')
        }
        const db = (await response.json()) as ArtworkImagesDB

        const baseURL = import.meta.env.PROD
            ? `https://storage.googleapis.com/${db.bucketName}`
            : ''

        db.getImageURL = (id: string, size: string) =>
            `${baseURL}/artworks/images/${size}/${id}.webp`

        return db
    })
    return (
        <ArtworkImagessDBContext.Provider value={artworks}>
            {props.children}
        </ArtworkImagessDBContext.Provider>
    )
}

export function useArtworkImagesDBResource() {
    return useContext(ArtworkImagessDBContext)
}

export function useArtworkImages() {
    const resolvedResourceContext = useArtworkImagesDBResource()
    const artworkImagesDB = resolvedResourceContext?.()
    return artworkImagesDB?.images
}

export function useArtworkImage(id: string, size: ArtworkSize): ArtworkImage | undefined {
    const images = useArtworkImages()
    return images?.[id]?.[size]
}
