export type AnimationId = 'none' | 'gigue' | 'gigueMore'

// Only something that equals to 'true' (case-insensitive, trimmed) but be considered to be true
type BooleanString = string

export interface Settings {
	artworksWallAnimation: AnimationId
	filterOnAvailableByDefault: BooleanString
}

export const defaultSettings: Settings = {
	artworksWallAnimation: 'none',
	filterOnAvailableByDefault: 'false',
}

export function isBooleanStringTrue(value: BooleanString) {
	return value.trim().toLowerCase() === 'true'
}
