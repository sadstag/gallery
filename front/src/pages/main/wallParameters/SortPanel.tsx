
import { useWallModel } from '../../../context/WallModelProvider'
import { type SortType, invertDirection, sortTypes } from '../../../model/wall/Sort'
import styles from './wallParameters.module.css'


export const SortPanel = () => {

    const [{ sort }, setWallModel] = useWallModel()

    return <div class={styles.sortPanel}>
        Sort on <select value={sort.on} onChange={
            ({ target }) => { setWallModel('sort', { on: target.value as SortType, direction: 'asc' }) }
        }>
            {/* biome-ignore lint/correctness/useJsxKeyInIterable: <explanation> */}
            {sortTypes.map(sortType => <option value={sortType}>{`=> ${sortType}`}</option>)}
        </select>
        (<button type="button" onClick={() => setWallModel('sort', invertDirection)}>{sort.direction}</button>)
    </div>
}