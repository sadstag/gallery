import {
    type ParentProps,
    type Resource,
    createContext,
    createResource,
    useContext
} from 'solid-js'
import type { Artwork } from '../model/Artwork'

type ArtworksDB = {
    meta?: {
        generated: string
        source: string
    }

    artworks: Artwork[]
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
        const response = await fetch('/artworks.json')
        if (!response.ok) {
            throw Error('ERR')
        }
        return response.json()
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
