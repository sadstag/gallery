export type AnimationId = 'none' | 'gigue' | 'gigueMore'

export interface Settings extends Record<string, string> {
	artworksWallAnimation: AnimationId
}

export const defaultSettings: Settings = {
	artworksWallAnimation: 'none',
}
