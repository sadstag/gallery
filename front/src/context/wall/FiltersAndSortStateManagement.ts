import type { Artwork } from '../../model/Artwork'
import { isBooleanStringTrue } from '../../model/Settings'
import { type AppliedFilter, type FilterType, filterTypes } from '../../model/wall/Filter'
import { type Sort, type SortType, sortTypes } from '../../model/wall/Sort'
import { useArtworks } from '../ArtworksDBProvider'
import { useSetting } from '../SettingsProvider'
import {
	retrieveFiltersAndSort as getFromLocalstorage,
	persistFiltersAndSort as storeInLocalstorage,
} from './LocalStorage'
import { retrieveFiltersAndSort as getURLParameters, persistFiltersAndSort as setURLParameters } from './URLParameters'

export const computeAvailableSorts = (artworks: Artwork[]): SortType[] =>
	sortTypes.filter(
		sortType => sortType !== 'defaultSort' || artworks.some(({ default_sort }) => default_sort !== undefined),
	)

export const computeAvailableFilters = (artworks: Artwork[]): FilterType[] =>
	filterTypes.filter(
		filterType =>
			filterType !== 'hideArtworksHiddenAtFirst' ||
			artworks.some(({ hidden_at_first }) => hidden_at_first !== undefined),
	)

// when no filter found in URL/storage
const computeInitialFilters = (availableFilters: FilterType[]) => {
	const filterOnAvailableByDefault = useSetting<'filterOnAvailableByDefault'>('filterOnAvailableByDefault')

	const filters: AppliedFilter[] = []
	if (availableFilters.includes('hideArtworksHiddenAtFirst')) {
		filters.push({ on: 'hideArtworksHiddenAtFirst', value: { mustBeTrue: true } })
	}
	if (availableFilters.includes('available') && isBooleanStringTrue(filterOnAvailableByDefault)) {
		filters.push({ on: 'available', value: { mustBeTrue: true } })
	}

	return filters
}

const computeInitialSort = (availableSorts: SortType[]): Sort => {
	return availableSorts.includes('defaultSort')
		? { on: 'defaultSort', direction: 'asc' }
		: { on: 'year', direction: 'desc' }
}

export const persistFiltersAndSort = (filters: AppliedFilter[], sort: Sort) => {
	setURLParameters(filters, sort)
	storeInLocalstorage(filters, sort)
}

type LoadedFiltersAndSort = {
	availableFilters: FilterType[]
	availableSorts: SortType[]
	appliedFilters: AppliedFilter[]
	appliedSort: Sort
	persistFiltersAndSort: typeof persistFiltersAndSort
}
export const loadFilters = (): LoadedFiltersAndSort => {
	const artworks = useArtworks()

	const availableFilters = computeAvailableFilters(artworks)
	const availableSorts = computeAvailableSorts(artworks)

	let appliedFilters: AppliedFilter[]
	let appliedSort: Sort

	// TODO search in URL then localstorage
	const [filtersFromURL, sortFromURL] = getURLParameters()
	if (filtersFromURL && sortFromURL) {
		appliedFilters = filtersFromURL
		appliedSort = sortFromURL
	} else {
		const [filtersFromLocalstorage, sortFromLocalstorage] = getFromLocalstorage()
		if (filtersFromLocalstorage.length && sortFromLocalstorage) {
			appliedFilters = filtersFromLocalstorage
			appliedSort = sortFromLocalstorage
		} else {
			appliedFilters = computeInitialFilters(availableFilters)
			appliedSort = computeInitialSort(availableSorts)
		}
	}

	return {
		availableFilters,
		appliedFilters,
		availableSorts,
		appliedSort,
		persistFiltersAndSort,
	}
}
