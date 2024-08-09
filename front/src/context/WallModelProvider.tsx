import {
    type ParentProps,
    createContext,
    useContext
} from 'solid-js'
import { createStore } from 'solid-js/store'
import type { WallModel } from '../model/wall/WallModel'


const WallModelContext = createContext<ReturnType<typeof createStore<WallModel>>>()

export function WallModelProvider(props: ParentProps) {

    const wallStore = createStore<WallModel>({
        appliedFilters: [
            //{ on: 'year', value: { min: 2021, max: 2021 } }
            //{ on: 'textContent', value: { contains: 'BlEu' } }
        ], sort: { on: 'year', direction: 'desc' }
    })



    return (
        <WallModelContext.Provider value={wallStore}>
            {props.children}
        </WallModelContext.Provider>
    )
}

export function useWallModel() {
    const ctx = useContext(WallModelContext)
    if (!ctx) {
        throw "No wall model conrtext defined !"
    }
    return ctx
}
