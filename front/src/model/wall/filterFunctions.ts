import type { Artwork } from '../Artwork'
import type { Filter, FilterType } from './Filter'

function escapeRegExp(text: string) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

export const filterFunctions: {
	[F in FilterType]: (filter: Filter[F]) => (a: Artwork) => boolean
} = {
	id: filter => {
		const re = new RegExp(escapeRegExp(filter.contains), 'gi')
		return ({ id }) => re.test(id)
	},

	available:
		({ mustBeTrue }) =>
		({ available }) =>
			available === mustBeTrue,

	textContent: filter => {
		const re = new RegExp(escapeRegExp(filter.contains), 'gi')
		return ({ title = '', description = '', remarks = '' }) =>
			re.test(title) || re.test(description) || re.test(remarks)
	},

	year:
		({ min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY }) =>
		({ year }) =>
			year === undefined ? true : year > min && year < max,
}
