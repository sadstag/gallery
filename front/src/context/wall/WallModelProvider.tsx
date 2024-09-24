import type { Artwork } from '@model/Artwork'
import type { AppliedFilter, FilterType } from '@model/wall/Filter'
import type { Sort } from '@model/wall/Sort'
import type { WallModel } from '@model/wall/WallModel'
import { applyFilters } from '@model/wall/filterFunctions'
import { applySort } from '@model/wall/sortFunctions'
import { type ParentProps, createContext, createEffect, useContext } from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { useArtworks } from '../ArtworksDBProvider'
import { retrieveWallParameters } from './wallParametersIO'

type WallModelContextValue = {
	wallModel: WallModel
	operations: {
		invertSortDirection: () => void
		setSort: (sort: Sort) => void
		setFilter: (filter: AppliedFilter) => void
		removeFilter: (type: FilterType) => void
	}
}

const WallModelContext = createContext<WallModelContextValue>()

const filterArtworks = (artworks: Artwork[], filters: AppliedFilter[], sort: Sort): Artwork[] => {
	const filtered = applyFilters(filters, [...artworks])
	applySort(sort, filtered)
	return filtered
}

// proxied wallModel, to in used in produce()
const updateProxiedFilteredArtworks = (wallModel: WallModel, artworks: Artwork[]) => {
	wallModel.filteredArtworks = filterArtworks(artworks, wallModel.appliedFilters, wallModel.sort)
}

export function WallModelProvider(props: ParentProps) {
	const artworks = useArtworks()

	const { availableFilters, appliedFilters, availableSorts, appliedSort, persistFiltersAndSort } =
		retrieveWallParameters()

	const [wallModel, setWallModel] = createStore<WallModel>({
		appliedFilters,
		sort: appliedSort,
		availableSorts: availableSorts,
		availableFilters,
		artworks,
		filteredArtworks: filterArtworks(artworks, appliedFilters, appliedSort),
	})

	createEffect(() => {
		persistFiltersAndSort(wallModel.appliedFilters, wallModel.sort)
	})

	const value: WallModelContextValue = {
		wallModel,
		operations: {
			invertSortDirection() {
				setWallModel(
					produce(wallModel => {
						wallModel.sort.direction = wallModel.sort.direction === 'asc' ? 'desc' : 'asc'
						updateProxiedFilteredArtworks(wallModel, artworks)
					}),
				)
			},
			setSort(sort: Sort) {
				setWallModel(
					produce(wallModel => {
						wallModel.sort = sort
						updateProxiedFilteredArtworks(wallModel, artworks)
					}),
				)
			},
			setFilter(filter: AppliedFilter) {
				setWallModel(
					produce(wallModel => {
						const pos = wallModel.appliedFilters.findIndex(({ on }) => on === filter.on)
						if (pos === -1) {
							wallModel.appliedFilters.push(filter)
						} else {
							wallModel.appliedFilters.splice(pos, 1, filter)
						}
						updateProxiedFilteredArtworks(wallModel, artworks)
					}),
				)
			},
			removeFilter(type: FilterType) {
				setWallModel(
					produce(wallModel => {
						const pos = wallModel.appliedFilters.findIndex(({ on }) => on === type)
						if (pos >= 0) {
							wallModel.appliedFilters.splice(pos, 1)
							updateProxiedFilteredArtworks(wallModel, artworks)
						}
					}),
				)
			},
		},
	}

	return <WallModelContext.Provider value={value}>{props.children}</WallModelContext.Provider>
}

export function useWallModel() {
	const ctx = useContext(WallModelContext)
	if (!ctx) {
		throw 'No wall model context defined !'
	}
	return ctx
}
