import type { ArtworkId } from './base'

export type Artwork = {
	id: ArtworkId

	title?: string
	subtitle?: string
	year?: number
	remarks?: string
	description?: string
	category?: string

	width?: number
	height?: number
	depth?: number
	technic?: string
	support?: string

	available?: boolean

	// biome-ignore lint/style/useNamingConvention: umastered python code
	default_sort?: number
	// biome-ignore lint/style/useNamingConvention: umastered python code
	hidden_at_first?: boolean
}
