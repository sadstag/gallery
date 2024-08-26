import {
    type ParentProps,
    createContext,
    createMemo,
    useContext
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import { type AppliedFilter, type FilterType, filterTypes, } from '../model/wall/Filter'
import { type Sort, type SortType, sortTypes } from '../model/wall/Sort'
import type { WallModel } from '../model/wall/WallModel'
import { useArtworks } from './ArtworksDBProvider'

type WallModelContextValue = [
    wallModel: WallModel,
    availableSorts: SortType[],
    availableFilters: FilterType[],
    operations: {
        invertSortDirection: () => void
        setSort: (sort: Sort) => void
        setFilter: (filter: AppliedFilter) => void
        removeFilter: (type: FilterType) => void
    }
]

const WallModelContext = createContext<WallModelContextValue>()

export function WallModelProvider(props: ParentProps) {

    const artworks = useArtworks()

    const availableSorts = createMemo(() =>
        sortTypes.filter(
            sortType => sortType !== 'defaultSort' || artworks.some(({ default_sort }) => default_sort !== undefined),
        ))

    const availableFilters = createMemo(() =>
        filterTypes.filter(
            filterType => filterType !== 'hideArtworksHiddenAtFirst' || artworks.some(({ hidden_at_first }) => hidden_at_first !== undefined)
        )
    )

    const initialSort: Sort = availableSorts().includes('defaultSort')
        ? { on: 'defaultSort', direction: 'asc' }
        : { on: 'year', direction: 'desc' }

    const initialAppliedFilters: AppliedFilter[] = availableFilters().includes('hideArtworksHiddenAtFirst') ? [
        { on: 'hideArtworksHiddenAtFirst', value: { mustBeTrue: true } }
    ] : []

    const [wallModel, setWallModel] = createStore<WallModel>({
        appliedFilters: initialAppliedFilters,
        sort: initialSort
    })

    const value: WallModelContextValue = [
        wallModel,
        availableSorts(),
        availableFilters(),
        {
            invertSortDirection() {
                setWallModel('sort', produce((sort: Sort) => {
                    sort.direction = sort.direction === 'asc' ? 'desc' : 'asc'
                }))
            },
            setSort(sort: Sort) {
                setWallModel('sort', sort)
            },
            setFilter(filter: AppliedFilter) {
                setWallModel(produce((wallModel) => {
                    const pos = wallModel.appliedFilters.findIndex(({ on }) => on === filter.on)
                    if (pos === -1) {
                        wallModel.appliedFilters.push(filter)
                    } else {
                        wallModel.appliedFilters.splice(pos, 1, filter)
                    }
                }))
            },
            removeFilter(type: FilterType) {
                setWallModel(produce((wallModel) => {
                    const pos = wallModel.appliedFilters.findIndex(({ on }) => on === type)
                    if (pos >= 0) {
                        wallModel.appliedFilters.splice(pos, 1)
                    }
                }
                ))
            }
        }
    ]

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
