
import { Button } from '@ds/Button/Button'
import { SortIcon } from '@ds/Icon/SortIcon'
import { Select } from '@ds/Select/Select'
import { useWallModel } from '../../../context/wall/WallModelProvider'
import { type SortType, preferedDirectionForSortType, sortTypeLabels } from '../../../model/wall/Sort'
import styles from './wallParameters.module.css'

export const SortPanel = () => {
    const { wallModel, operations: { invertSortDirection, setSort } } = useWallModel()

    return <div class={styles.sortPanel}>
        <Select
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
                    sortType => ({ value: sortType, label: sortTypeLabels[sortType] })
                )
            }
        />
        <Button onClick={invertSortDirection}>
            <SortIcon classList={{ [styles['sort-icon']]: true, [styles.descending]: wallModel.sort.direction === 'desc' }} />
        </Button>
    </div>
}