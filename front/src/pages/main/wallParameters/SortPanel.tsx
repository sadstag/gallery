
import { useWallModel } from '../../../context/WallModelProvider'
import { Select } from '../../../design-system/Select/Select'
import { type SortType, preferedDirectionForSortType } from '../../../model/wall/Sort'
import styles from '../Wall.module.css'

export const SortPanel = () => {
    const [{ sort }, availableSorts, _, { invertSortDirection, setSort }] = useWallModel()

    return <div class={styles.sortPanel}>
        sorted by <Select
            value={sort.on}
            onChange={
                (value) => {
                    setSort({
                        on: value as SortType, direction: preferedDirectionForSortType[value as SortType]
                    })
                }
            }
            options={
                availableSorts.map(
                    sortType => ({ value: sortType, label: sortType })
                )
            }
        />

        (<button type="button" onClick={invertSortDirection}>{sort.direction}</button>)
    </div>
}