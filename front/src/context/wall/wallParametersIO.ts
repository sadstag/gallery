import type { Artwork } from '@model/Artwork'
import { isBooleanStringTrue } from '@model/Settings'
import { type AppliedFilter, type FilterType, filterTypes } from '@model/wall/Filter'
import { type Sort, type SortType, sortTypes } from '@model/wall/Sort'
import { batch, createSignal } from 'solid-js'
import { useArtworks } from '../ArtworksDBProvider'
import { useSetting } from '../SettingsProvider'
import {
	persistFiltersAndSort as persistWallParametersInURL,
	retrieveFiltersAndSort as retrieveWallParametersFromURL,
} from './URLParameters'
import {
	persistFiltersAndSort as persistWallParametersInLocalstorage,
	retrieveFiltersAndSort as retrieveWallParametersFromLocalstorage,
} from './localStorage'

export const computeAvailableSorts = (artworks: Artwork[]): SortType[] =>
	sortTypes.filter(
		sortType => sortType !== 'defaultSort' || artworks.some(({ default_sort }) => default_sort !== undefined),
	)

const definedOnceOrMore = (property: keyof Artwork, artworks: Artwork[]): boolean =>
	artworks.some(artwork => property in artwork && artwork[property] !== undefined)

const filterIsAvailableWhen: { [F in FilterType]?: (artworks: Artwork[]) => boolean } = {
	hideArtworksHiddenAtFirst: artworks => definedOnceOrMore('hidden_at_first', artworks),
	category: artworks => definedOnceOrMore('category', artworks),
}

export const computeAvailableFilters = (artworks: Artwork[]): FilterType[] =>
	filterTypes.filter(filterType => (filterIsAvailableWhen[filterType] ?? (() => true))(artworks))

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

// when no sort found in URL/storage
const computeInitialSort = (availableSorts: SortType[]): Sort => {
	return availableSorts.includes('defaultSort')
		? { on: 'defaultSort', direction: 'asc' }
		: { on: 'year', direction: 'desc' }
}

type LoadedFiltersAndSort = {
	availableFilters: FilterType[]
	availableSorts: SortType[]
	appliedFilters: AppliedFilter[]
	appliedSort: Sort
	persistFiltersAndSort: typeof persistWallParameters
}
export const retrieveWallParameters = (): LoadedFiltersAndSort => {
	const artworks = useArtworks()

	const availableFilters = computeAvailableFilters(artworks)
	const availableSorts = computeAvailableSorts(artworks)

	const [appliedFilters, setAppliedFilters] = createSignal<AppliedFilter[]>([])
	const [appliedSort, setAppliedSort] = createSignal<Sort>({ on: 'defaultSort', direction: 'desc' })

	const apply = (filters: AppliedFilter[], sort: Sort) => {
		let sortToApply = sort
		let filtersToApply = filters
		if (!availableSorts.includes(sort.on)) {
			// can happen on localhost while dev on several sites
			// or whenever available sort move after a site update
			sortToApply = computeInitialSort(availableSorts)
		}
		if (filters.some(filter => !availableFilters.includes(filter.on))) {
			filtersToApply = computeInitialFilters(availableFilters)
		}
		batch(() => {
			setAppliedFilters(filtersToApply)
			setAppliedSort(sortToApply)
		})
	}

	const { filters: filtersFromURL, sort: sortFromURL } = retrieveWallParametersFromURL() || {}
	if (filtersFromURL && sortFromURL) {
		apply(filtersFromURL, sortFromURL)
	} else {
		const [filtersFromLocalstorage, sortFromLocalstorage] = retrieveWallParametersFromLocalstorage()
		if (filtersFromLocalstorage.length && sortFromLocalstorage) {
			apply(filtersFromLocalstorage, sortFromLocalstorage)
		} else {
			apply(computeInitialFilters(availableFilters), computeInitialSort(availableSorts))
		}
	}

	return {
		availableFilters,
		availableSorts,
		appliedFilters: appliedFilters(),
		appliedSort: appliedSort(),
		persistFiltersAndSort: persistWallParameters,
	}
}

export const persistWallParameters = (filters: AppliedFilter[], sort: Sort) => {
	persistWallParametersInURL(filters, sort)
	persistWallParametersInLocalstorage(filters, sort)
}
