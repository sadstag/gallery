import {
    type ParentProps,
    createContext,
    createEffect,
    useContext
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import type { Artwork } from '../model/Artwork'
import { isBooleanStringTrue } from '../model/Settings'
import { type AppliedFilter, type FilterType, filterTypes, } from '../model/wall/Filter'
import { type Sort, type SortType, sortTypes } from '../model/wall/Sort'
import type { WallModel } from '../model/wall/WallModel'
import { applyFilters } from '../model/wall/filterFunctions'
import { applySort } from '../model/wall/sortFunctions'
import { useArtworks } from './ArtworksDBProvider'
import { useSetting } from './SettingsProvider'

type WallModelContextValue = {
    wallModel: WallModel,
    operations: {
        invertSortDirection: () => void
        setSort: (sort: Sort) => void
        setFilter: (filter: AppliedFilter) => void
        removeFilter: (type: FilterType) => void
    }
}

const WallModelContext = createContext<WallModelContextValue>()

const computeAvailableSorts = (artworks: Artwork[]): SortType[] => sortTypes.filter(
    sortType => sortType !== 'defaultSort' || artworks.some(({ default_sort }) => default_sort !== undefined)
)

const computeAvailableFilters = (artworks: Artwork[]): FilterType[] => filterTypes.filter(
    filterType => filterType !== 'hideArtworksHiddenAtFirst' || artworks.some(({ hidden_at_first }) => hidden_at_first !== undefined)
)

const filterArtworks = (artworks: Artwork[], filters: AppliedFilter[], sort: Sort): Artwork[] => {
    const filtered = applyFilters(filters, artworks)
    applySort(sort, filtered)
    console.log('compute', { artworks, filtered })
    return filtered
}

// proxied wallModel, to in used in produce()
const updateProxiedFilteredArtworks = (wallModel: WallModel, artworks: Artwork[]) => {
    wallModel.filteredArtworks = filterArtworks(artworks, wallModel.appliedFilters, wallModel.sort)
}

export function WallModelProvider(props: ParentProps) {

    const artworks = useArtworks()

    const filterOnAvailableByDefault = useSetting<'filterOnAvailableByDefault'>('filterOnAvailableByDefault')

    const initialSort: Sort = computeAvailableSorts(artworks).includes('defaultSort')
        ? { on: 'defaultSort', direction: 'asc' }
        : { on: 'year', direction: 'desc' }

    const initialAppliedFilters: AppliedFilter[] = []
    const availableFilters = computeAvailableFilters(artworks)
    if (availableFilters.includes('hideArtworksHiddenAtFirst')) {
        initialAppliedFilters.push({ on: 'hideArtworksHiddenAtFirst', value: { mustBeTrue: true } })

    }
    if (availableFilters.includes('available') && isBooleanStringTrue(filterOnAvailableByDefault)) {
        initialAppliedFilters.push({ on: 'available', value: { mustBeTrue: true } })
    }

    const [wallModel, setWallModel] = createStore<WallModel>({
        appliedFilters: initialAppliedFilters,
        sort: initialSort,
        availableSorts: computeAvailableSorts(artworks),
        availableFilters: computeAvailableFilters(artworks),
        artworks,
        filteredArtworks: filterArtworks(artworks, initialAppliedFilters, initialSort)
    })

    createEffect(() => {
        setWallModel(
            produce(
                (wallModel) => {
                    wallModel.artworks = artworks
                    wallModel.availableSorts = computeAvailableSorts(artworks)
                    wallModel.availableFilters = computeAvailableFilters(artworks)
                    updateProxiedFilteredArtworks(wallModel, artworks)
                }
            )
        )
    })

    const value: WallModelContextValue = {
        wallModel,
        operations: {
            invertSortDirection() {
                setWallModel(produce((wallModel) => {
                    wallModel.sort.direction = wallModel.sort.direction === 'asc' ? 'desc' : 'asc';
                    updateProxiedFilteredArtworks(wallModel, artworks)
                }))
            },
            setSort(sort: Sort) {
                setWallModel(produce((wallModel) => {
                    wallModel.sort = sort;
                    updateProxiedFilteredArtworks(wallModel, artworks)
                }))
            },
            setFilter(filter: AppliedFilter) {
                setWallModel(produce((wallModel) => {
                    const pos = wallModel.appliedFilters.findIndex(({ on }) => on === filter.on)
                    if (pos === -1) {
                        wallModel.appliedFilters.push(filter)
                    } else {
                        wallModel.appliedFilters.splice(pos, 1, filter)
                    }
                    updateProxiedFilteredArtworks(wallModel, artworks)
                }))
            },
            removeFilter(type: FilterType) {
                setWallModel(produce((wallModel) => {
                    const pos = wallModel.appliedFilters.findIndex(({ on }) => on === type)
                    if (pos >= 0) {
                        wallModel.appliedFilters.splice(pos, 1)
                        updateProxiedFilteredArtworks(wallModel, artworks)
                    }
                }
                ))
            }
        }
    }

    return (
        <WallModelContext.Provider value={value}>
            {props.children}
        </WallModelContext.Provider>
    )
}

export function useWallModel() {
    const ctx = useContext(WallModelContext)
    if (!ctx) {
        throw "No wall model context defined !"
    }
    return ctx
}
