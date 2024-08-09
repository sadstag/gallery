
import { SortPanel } from './SortPanel'
import styles from './wallParameters.module.css'

export const WallParameters = () => {

    return <div class={styles.parameters}>
        {/* <AppliedFiltersPanel filters={filters} /> */}
        <SortPanel />
    </div>
}