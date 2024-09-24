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

type FilterOnExactText = {
	equals: string
}

export function ensureMinMaxOrdered(range: FilterOnRange): FilterOnRange {
	if (range.min <= range.max) {
		return range
	}
	return { min: range.max, max: range.min }
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

export type AppliedFilterOnCategory = {
	on: 'category'
	value: FilterOnExactText
}

export type AppliedFilter =
	| AppliedFilterOnId
	| ShowOnlyAvailable
	| AppliedFilterOnTextContent
	| AppliedFilterOnYear
	| HideArtworksHiddenAtFirst
	| AppliedFilterOnCategory

export type FilterType = AppliedFilter['on']

export const filterTypes: FilterType[] = [
	'available',
	'year',
	'textContent',
	'hideArtworksHiddenAtFirst',
	'id',
	'category',
]
