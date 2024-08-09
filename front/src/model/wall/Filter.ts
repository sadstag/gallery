type FilterOnBoolean = {
	mustBeTrue: boolean
}

type FilterOnText = {
	contains: string
}

type FilterOnRange =
	| {
			min: number
			max: number
	  }
	| {
			min?: number
			max: number
	  }
	| {
			min: number
			max?: number
	  }

// filtering just by artwork reference
type FilterById = FilterOnText & {
	type: 'id'
}

// filtering on title, description, remarks and any other textual content
type FilterByTextContent = FilterOnText & {
	type: 'textContent'
}

type FilterByYear = FilterOnRange & {
	type: 'year'
}

export type Filter = {
	id: FilterById
	available: FilterOnBoolean
	textContent: FilterByTextContent
	year: FilterByYear
}

export type FilterType = keyof Filter

export type AppliedFilters = Partial<{
	[Type in FilterType]: Filter[Type]
}>
