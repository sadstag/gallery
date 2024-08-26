
import { useWallModel } from '../../../context/WallModelProvider'
import { Select } from '../../../design-system/Select/Select'
import { type SortType, preferedDirectionForSortType } from '../../../model/wall/Sort'
import styles from '../Wall.module.css'

export const SortPanel = () => {
    const { wallModel, operations: { invertSortDirection, setSort } } = useWallModel()

    return <div class={styles.sortPanel}>
        sorted by <Select
            value={wallModel.sort.on}
            onChange={
                (value) => {
                    setSort({
                        on: value as SortType, direction: preferedDirectionForSortType[value as SortType]
                    })
                }
            }
            options={
                wallModel.availableSorts.map(
                    sortType => ({ value: sortType, label: sortType })
                )
            }
        />

        (<button type="button" onClick={invertSortDirection}>{wallModel.sort.direction}</button>)
    </div>
}