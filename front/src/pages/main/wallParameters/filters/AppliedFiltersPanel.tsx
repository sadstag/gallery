import { Show, createSignal } from 'solid-js'
import { useWallModel } from '../../../../context/WallModelProvider'
import { Button } from '../../../../design-system/Button/Button'
import { FiltersEditionModale } from './edition/Modale'

export const AppliedFiltersPanel = () => {
    const [showFilterCreationModale, setShowFilterCreationModale] = createSignal(true)

    const [{ appliedFilters }] = useWallModel()
    return <>
        <Button onClick={() => setShowFilterCreationModale(true)}>
            <Show when={appliedFilters.length > 0} fallback="Apply filter">
                Fitering on {appliedFilters.length} <Show when={appliedFilters.length > 1} fallback="criterion">criteria</Show>
            </Show>
        </Button>
        <Show when={showFilterCreationModale()}>
            <FiltersEditionModale onClose={() => setShowFilterCreationModale(false)} />
        </Show>
    </>
}