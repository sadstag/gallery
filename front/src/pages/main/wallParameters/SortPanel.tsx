
import { useWallModel } from '../../../context/WallModelProvider'
import type { SortType } from '../../../model/wall/Sort'
import styles from './wallParameters.module.css'

export const SortPanel = () => {

    const [{ sort }, availableSorts, { invertSortDirection, setSort }] = useWallModel()


    return <div class={styles.sortPanel}>
        Sort on <select value={sort.on} onChange={
            ({ target }) => { setSort({ on: target.value as SortType, direction: 'asc' }) }
        }>
            {/* biome-ignore lint/correctness/useJsxKeyInIterable: <explanation> */}
            {availableSorts.map(sortType => <option value={sortType}>{`=> ${sortType}`}</option>)}
        </select>
        (<button type="button" onClick={invertSortDirection}>{sort.direction}</button>)
    </div>
}