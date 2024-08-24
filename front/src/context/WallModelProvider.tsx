import {
    type ParentProps,
    createContext,
    createMemo,
    useContext
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import type { AppliedFilter, FilterType, } from '../model/wall/Filter'
import { type Sort, type SortType, sortTypes } from '../model/wall/Sort'
import type { WallModel } from '../model/wall/WallModel'
import { useArtworks } from './ArtworksDBProvider'

type WallModelContextValue = [
    wallModel: WallModel,
    availableSorts: SortType[],
    operations: {
        invertSortDirection: () => void
        setSort: (sort: Sort) => void
        setFilter: (filter: AppliedFilter) => void
        removeFilter: (type: FilterType) => void
    }
]

const WallModelContext = createContext<WallModelContextValue>()

export function WallModelProvider(props: ParentProps) {

    const artworks = Object.values(useArtworks())
    const availableSorts = createMemo(() =>
        sortTypes.filter(
            sortType => sortType !== 'defaultSort' || artworks.some(({ default_sort }) => default_sort !== undefined),
        ))

    const initialSort: Sort = availableSorts().includes('defaultSort')
        ? { on: 'defaultSort', direction: 'asc' }
        : { on: 'year', direction: 'desc' }

    const [wallModel, setWallModel] = createStore<WallModel>({
        appliedFilters: [
            //{ on: 'year', value: { min: 2021, max: 2021 } }
            //{ on: 'textContent', value: { contains: 'BlEu' } }
        ],
        sort: initialSort
    })

    const value: WallModelContextValue = [
        wallModel,
        availableSorts(),
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
                setWallModel('appliedFilters', produce((appliedFilters) => {
                    const pos = appliedFilters.findIndex(({ on }) => on === filter.on)
                    if (pos === -1) {
                        appliedFilters.push(filter)
                    } else {
                        appliedFilters.splice(pos, 1, filter)
                    }
                }))
            },
            removeFilter(type: FilterType) {
                setWallModel('appliedFilters', produce((appliedFilters) => {
                    const pos = appliedFilters.findIndex(({ on }) => on === type)
                    if (pos >= 0) {
                        appliedFilters.splice(pos, 1)
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
