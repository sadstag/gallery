import {
    createContext,
    createResource,
    ParentProps,
    Resource,
    useContext
} from 'solid-js'
import { Artwork } from '../model/Artwork'

type ArtworksDB = {
    meta?: {
        generated: string
        source: string
    }
    bucket_name: string
    artworks: Artwork[]
    // added by context
    getImageURL: (id: string, size: string) => string
}

type IndexedArtworks = {
    [is: string]: Artwork
}

function indexArtworks(artworks: Artwork[]): IndexedArtworks {
    return Object.fromEntries(artworks.map((a: Artwork) => [a.id, a]) ?? {})
}

const ArtworksDBContext = createContext<Resource<ArtworksDB>>()

export function ArtworksDBProvider(props: ParentProps) {
    const [artworks] = createResource<ArtworksDB>(async function f() {
        const response = await fetch(`/artworks.json`)

        if (!response.ok) {
            throw Error('ERR')
        }
        const db = (await response.json()) as ArtworksDB

        const baseURL = import.meta.env.PROD
            ? `https://storage.googleapis.com/${db.bucket_name}`
            : ''

        db.getImageURL = (id: string, size: string) =>
            `${baseURL}/artworks/images/${size}/${id}.webp`

        return db
    })
    return (
        <ArtworksDBContext.Provider value={artworks}>
            {props.children}
        </ArtworksDBContext.Provider>
    )
}

export function useArtworksDBResource() {
    return useContext(ArtworksDBContext)
}

export function useArtworks() {
    const resolvedResourceContext = useArtworksDBResource()
    const artworkDB = resolvedResourceContext?.()
    return indexArtworks(artworkDB?.artworks ?? [])
}

export function useArtwork(id: string) {
    const artworks = useArtworks()
    return artworks[id]
}
