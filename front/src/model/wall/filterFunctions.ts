import type { Artwork } from '../Artwork'
import type { AppliedFilter, FilterType } from './Filter'

function escapeRegExp(text: string) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const T = () => true

const filterFunctions: {
	[F in FilterType]: (filter: AppliedFilter['value']) => (a: Artwork) => boolean
} = {
	id: filterValue => {
		if (!('contains' in filterValue)) {
			return T
		}
		const re = new RegExp(escapeRegExp(filterValue.contains.trim()), 'gi')
		return ({ id }) => re.test(id)
	},

	available:
		() =>
		({ available }) =>
			available ?? false,

	textContent: filterValue => {
		if (!('contains' in filterValue)) {
			return T
		}
		const re = new RegExp(escapeRegExp(filterValue.contains.trim()), 'gi')
		return ({ title = '', description = '', remarks = '' }) =>
			re.test(title) || re.test(description) || re.test(remarks)
	},

	year: filterValue => {
		if (!('min' in filterValue && 'max' in filterValue)) {
			return T
		}
		const { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY } = filterValue
		return ({ year }) => (year === undefined ? true : year >= min && year <= max)
	},

	hideArtworksHiddenAtFirst: filter => {
		if (!('mustBeTrue' in filter)) {
			return T
		}
		return ({ hidden_at_first = false }) => !hidden_at_first
	},
}

export function applyFilters(filters: AppliedFilter[], artworks: Artwork[]): Artwork[] {
	return filters.reduce(
		(artworksBeingFiltered, { on, value }) => artworksBeingFiltered.filter(filterFunctions[on](value)),
		artworks,
	)
}
