import {
    type ParentProps,
    createContext,
    useContext
} from 'solid-js'
import { createStore, produce } from 'solid-js/store'
import type { AppliedFilter } from '../model/wall/Filter'
import type { Sort } from '../model/wall/Sort'
import type { WallModel } from '../model/wall/WallModel'

type WallModelContextValue = {
    wallModel: WallModel
    invertSortDirection: () => void
    setSort: (sort: Sort) => void
    addNewFilter: (filter: AppliedFilter) => void
}

const WallModelContext = createContext<WallModelContextValue>()

export function WallModelProvider(props: ParentProps) {

    const [wallModel, setWallModel] = createStore<WallModel>({
        appliedFilters: [
            //{ on: 'year', value: { min: 2021, max: 2021 } }
            //{ on: 'textContent', value: { contains: 'BlEu' } }
        ], sort: { on: 'year', direction: 'desc' }
    })

    const value = {
        wallModel,
        invertSortDirection() {
            setWallModel('sort', produce((sort: Sort) => {
                sort.direction = sort.direction === 'asc' ? 'desc' : 'asc'
            }))
        },
        setSort(sort: Sort) {
            setWallModel('sort', sort)
        },
        addNewFilter(filter: AppliedFilter) {
            if (wallModel.appliedFilters.find(({ on }) => on === filter.on)) {
                throw "can't add filter : filter type already applied"
            }
            setWallModel('appliedFilters', produce((appliedFilters) => appliedFilters.push(filter)))
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
