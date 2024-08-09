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

type AppliedFilterOnId = {
	on: 'id'
	value: FilterOnText
}

type AppliedFilterOnAvailable = {
	on: 'available'
	value: FilterOnBoolean
}

// filtering on title, description, remarks and any other textual content
type AppliedFilterOnTextContent = {
	on: 'textContent'
	value: FilterOnText
}

type AppliedFilterOnYear = {
	on: 'year'
	value: FilterOnRange
}

export type AppliedFilter =
	| AppliedFilterOnId
	| AppliedFilterOnAvailable
	| AppliedFilterOnTextContent
	| AppliedFilterOnYear

export type FilterType = AppliedFilter['on']
