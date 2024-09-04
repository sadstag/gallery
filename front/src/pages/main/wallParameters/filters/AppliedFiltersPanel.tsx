import { Show, createSignal } from 'solid-js'
import { useWallModel } from '../../../../context/wall/WallModelProvider'
import { Button } from '../../../../design-system/Button/Button'
import { FilterIcon } from '../../../../design-system/Icon/FilterIcon'
import styles from '../wallParameters.module.css'
import { FiltersEditionModale } from './edition/Modale'

export const AppliedFiltersPanel = () => {
    const [showFilterCreationModale, setShowFilterCreationModale] = createSignal(false)

    const { wallModel } = useWallModel()

    return <>
        <Button onClick={() => setShowFilterCreationModale(true)} highlighted={wallModel.appliedFilters.length > 0}>
            <FilterIcon classList={{ [styles['filter-icon']]: true }} />
            <Show when={wallModel.appliedFilters.length > 0} fallback="No active filter">
                {wallModel.appliedFilters.length} <Show when={wallModel.appliedFilters.length > 1} fallback="filter">filters</Show> applied
            </Show>
        </Button>
        <Show when={showFilterCreationModale()}>
            <FiltersEditionModale onClose={() => setShowFilterCreationModale(false)} />
        </Show>
    </>
}