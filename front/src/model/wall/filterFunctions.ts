import type { Artwork } from '../Artwork'
import type { AppliedFilter, FilterType } from './Filter'

function escapeRegExp(text: string) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const T = () => true

const filterFunctions: {
	[F in FilterType]: (filter: AppliedFilter['value']) => (a: Artwork) => boolean
} = {
	id: filter => {
		if (!('contains' in filter)) {
			return T
		}
		const re = new RegExp(escapeRegExp(filter.contains.trim()), 'gi')
		return ({ id }) => re.test(id)
	},

	available: filter => ('mustBeTrue' in filter ? ({ available }) => available === filter.mustBeTrue : T),

	textContent: filter => {
		if (!('contains' in filter)) {
			return T
		}
		const re = new RegExp(escapeRegExp(filter.contains.trim()), 'gi')
		return ({ title = '', description = '', remarks = '' }) =>
			re.test(title) || re.test(description) || re.test(remarks)
	},

	year: filter => {
		if (!('min' in filter || 'max' in filter)) {
			return T
		}
		const { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY } = filter
		return ({ year }) => (year === undefined ? true : year >= min && year <= max)
	},
}

export function applyFilters(filters: AppliedFilter[], artworks: Artwork[]): Artwork[] {
	return filters.reduce(
		(artworksBeingFiltered, { on, value }) => artworksBeingFiltered.filter(filterFunctions[on](value)),
		artworks,
	)
}
