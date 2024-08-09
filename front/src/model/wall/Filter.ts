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
export type AppliedFilterOnId = {
	on: 'id'
	value: FilterOnText
}

export type AppliedFilterOnAvailable = {
	on: 'available'
	value: FilterOnBoolean
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

export type AppliedFilter =
	| AppliedFilterOnId
	| AppliedFilterOnAvailable
	| AppliedFilterOnTextContent
	| AppliedFilterOnYear

export type FilterType = AppliedFilter['on']
