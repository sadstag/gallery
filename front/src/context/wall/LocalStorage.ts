import type { AppliedFilter } from '../../model/wall/Filter'
import type { Sort } from '../../model/wall/Sort'

export const persistFiltersAndSort = (filters: AppliedFilter[], sort: Sort) => {
	window.localStorage.setItem('filters', JSON.stringify(filters))
	window.localStorage.setItem('sort', JSON.stringify(sort))
}

export const retrieveFiltersAndSort = (): [filters: AppliedFilter[], sort: Sort | undefined] => {
	let filters: AppliedFilter[]
	let sort: Sort | undefined
	try {
		filters = JSON.parse(window.localStorage.getItem('filters') || '[]')
	} catch (_) {
		filters = []
	}
	const encodedSort = window.localStorage.getItem('sort')
	if (encodedSort) {
		try {
			sort = JSON.parse(encodedSort)
		} catch (_) {
			sort = undefined
		}
	}
	return [filters, sort]
}
