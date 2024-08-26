import type { Artwork } from '../Artwork'
import type { Sort, SortType } from './Sort'

const sortFunctionsAsc: { [On in SortType]: (a1: Artwork, a2: Artwork) => number } = {
	defaultSort: (
		{ default_sort: defaultSort1 = Number.MAX_SAFE_INTEGER },
		{ default_sort: defaultSort2 = Number.MAX_SAFE_INTEGER },
	) => defaultSort1 - defaultSort2,
	year: ({ year: y1 = Number.NEGATIVE_INFINITY }, { year: y2 = Number.NEGATIVE_INFINITY }) => y1 - y2,
	area: ({ width: w1 = 0, height: h1 = 0 }, { width: w2 = 0, height: h2 = 0 }) => w1 * h1 - w2 * h2,
}

export function applySort({ on, direction }: Sort, artworks: Artwork[]) {
	artworks.sort(sortFunctionsAsc[on])
	if (direction === 'desc') {
		artworks.reverse()
	}
}
