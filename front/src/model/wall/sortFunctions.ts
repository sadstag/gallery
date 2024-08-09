import type { Artwork } from '../Artwork'
import type { Sort, SortType } from './Sort'

const sortFunctionsAsc: { [On in SortType]: (a1: Artwork, a2: Artwork) => number } = {
	id: ({ id: id1 }, { id: id2 }) => id1.toLowerCase().localeCompare(id2.toLowerCase()),
	year: ({ year: y1 = Number.NEGATIVE_INFINITY }, { year: y2 = Number.NEGATIVE_INFINITY }) => y1 - y2,
	authorSort:
		// TODO with 'author_sort' column
		({ id: id1 }, { id: id2 }) => id1.toLowerCase().localeCompare(id2.toLowerCase()),
	area: ({ width: w1 = 0, height: h1 = 0 }, { width: w2 = 0, height: h2 = 0 }) => w1 * h1 - w2 * h2,
}

export function applySort({ on, direction }: Sort, artworks: Artwork[]) {
	artworks.sort(sortFunctionsAsc[on])
	if (direction === 'desc') {
		artworks.reverse()
	}
}
