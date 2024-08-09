import { useWallModel } from '../../../../context/WallModelProvider'
import { AddFilterButton } from './AddFilterButton'
import styles from './filters.module.css'

export const AppliedFiltersPanel = () => {

    const { wallModel: { appliedFilters } } = useWallModel()

    return <div class={styles.filtersPanel}>Applied filters : {appliedFilters.length}<AddFilterButton /></div>
}