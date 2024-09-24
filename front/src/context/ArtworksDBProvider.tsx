import type { Artwork } from '@model/Artwork'
import { type ParentProps, type Resource, createContext, createResource, useContext } from 'solid-js'

type ArtworksDB = {
	meta?: {
		generated: string
		source: string
	}
	artworks: Artwork[]
}

// synthetic data concerning all artworks :
// min/max year, categories ...
type ArtworksMemo = {
	year: { min: number; max: number }
	categories: string[]
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
	return <ArtworksDBContext.Provider value={artworks}>{props.children}</ArtworksDBContext.Provider>
}

export function useArtworksDBResource() {
	return useContext(ArtworksDBContext)
}

export function useArtworks() {
	const resolvedResourceContext = useArtworksDBResource()
	const artworkDB = resolvedResourceContext?.()
	const artworks = artworkDB?.artworks ?? []
	return artworks
}

export function useIndexedArtworks() {
	return indexArtworks(useArtworks())
}

export function useArtworksMemo(): ArtworksMemo {
	const resolvedResourceContext = useArtworksDBResource()
	const artworkDB = resolvedResourceContext?.()
	const artworks = artworkDB?.artworks ?? []

	const yearMemo = { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER }
	for (const { year } of artworks) {
		if (year !== undefined) {
			if (year < yearMemo.min) {
				yearMemo.min = year
			} else if (year > yearMemo.max) {
				yearMemo.max = year
			}
		}
	}

	const categories = [...new Set(artworks.map(({ category }) => category).filter(c => c !== undefined))]

	categories.sort()

	return { year: yearMemo, categories }
}

export function useArtwork(id: string): Artwork {
	const artworks = useIndexedArtworks()
	return artworks[id]
}
