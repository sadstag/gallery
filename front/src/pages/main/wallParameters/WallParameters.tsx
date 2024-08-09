
import { SortPanel } from './SortPanel'
import { AppliedFiltersPanel } from './filters/AppliedFiltersPanel'
import styles from './wallParameters.module.css'

export const WallParameters = () => {

    return <div class={styles.parameters}>
        <AppliedFiltersPanel />
        <SortPanel />
    </div>
}