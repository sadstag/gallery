import type { AppliedFilter } from '../../../../model/wall/Filter'
import { AddFilterButton } from './AddFilterButton'
import styles from './wallParameters.module.css'

type Props = {
    filters: AppliedFilter[]
    onNewFilter: (filter: AppliedFilter) => void
}

export const AppliedFiltersPanel = ({ filters, onNewFilter }: Props) => {

    return <div class={styles.filtersPanel}>Applied filters : {filters.length}<AddFilterButton onNewFilter={onNewFilter} /></div>
}