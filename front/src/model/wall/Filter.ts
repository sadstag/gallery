type FilterOnBoolean<V extends boolean = boolean> = {
	mustBeTrue: V
}

type FilterOnText = {
	contains: string
}

type FilterOnRange = {
	min: number
	max: number
}

// filtering just by artwork reference
export type AppliedFilterOnId = {
	on: 'id'
	value: FilterOnText
}

export type ShowOnlyAvailable = {
	on: 'available'
	value: FilterOnBoolean<true>
}

// filtering on title, description, remarks and any other textual content
export type AppliedFilterOnTextContent = {
	on: 'textContent'
	value: FilterOnText
}

export type AppliedFilterOnYear = {
	on: 'year'
	value: FilterOnRange
}

export type HideArtworksHiddenAtFirst = {
	on: 'hideArtworksHiddenAtFirst'
	value: FilterOnBoolean<true>
}

export type AppliedFilter =
	| AppliedFilterOnId
	| ShowOnlyAvailable
	| AppliedFilterOnTextContent
	| AppliedFilterOnYear
	| HideArtworksHiddenAtFirst

export type FilterType = AppliedFilter['on']

export const filterTypes: FilterType[] = ['available', 'year', 'textContent', 'hideArtworksHiddenAtFirst', 'id']
