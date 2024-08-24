import type { ArtworkId } from './Base'

export type Artwork = {
	id: ArtworkId

	title?: string
	year?: number
	remarks?: string
	description?: string

	width?: number
	height?: number
	depth?: number
	technic?: string
	support?: string

	available?: boolean

	// biome-ignore lint/style/useNamingConvention: <explanation>
	default_sort?: number
}
