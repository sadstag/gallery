import { useSearchParams } from '@solidjs/router'
import type { AppliedFilter } from '../../model/wall/Filter'
import type { Sort } from '../../model/wall/Sort'

export const persistFiltersAndSort = (filters: AppliedFilter[], sort: Sort) => {
	const [searchParams, setSearchParams] = useSearchParams()

	const newSearchParams = { ...searchParams }

	newSearchParams.filters = window.btoa(JSON.stringify(filters))
	newSearchParams.sort = window.btoa(JSON.stringify(sort))

	setSearchParams(newSearchParams, { replace: true })
}

export const retrieveFiltersAndSort = (): [filters: AppliedFilter[], sort: Sort | undefined] => {
	const [searchParams] = useSearchParams()

	let filters: AppliedFilter[] = []
	let sort: Sort | undefined

	if (searchParams.filters) {
		try {
			filters = JSON.parse(window.atob(searchParams.filters))
		} catch (_) {
			filters = []
		}
	}
	if (searchParams.sort) {
		try {
			sort = JSON.parse(window.atob(searchParams.sort))
		} catch (_) {
			sort = undefined
		}
	}

	return [filters, sort]
}
