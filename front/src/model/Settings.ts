export type AnimationId = 'none' | 'gigue' | 'gigueMore'

// Only something that equals to 'true' (case-insensitive, trimmed) but be considered to be true
type BooleanString = string
type NumberAsString = string

export interface Settings {
	artworksWallAnimation: AnimationId
	filterOnAvailableByDefault: BooleanString
	startIdleAnimationDelay: NumberAsString
}

export const defaultSettings: Settings = {
	artworksWallAnimation: 'none',
	filterOnAvailableByDefault: 'false',
	startIdleAnimationDelay: '10000',
}

export function isBooleanStringTrue(value: BooleanString) {
	return value.trim().toLowerCase() === 'true'
}
