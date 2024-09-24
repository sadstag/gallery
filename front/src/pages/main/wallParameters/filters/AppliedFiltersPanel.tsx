import { useWallModel } from '@context/wall/WallModelProvider'
import { Button } from '@ds/Button/Button'
import { FilterIcon } from '@ds/Icon/FilterIcon'
import { Show, createSignal } from 'solid-js'
import styles from '../wallParameters.module.css'
import { FiltersEditionModale } from './edition/Modale'

export const AppliedFiltersPanel = () => {
	const [showFilterCreationModale, setShowFilterCreationModale] = createSignal(false)

	const { wallModel } = useWallModel()

	return (
		<>
			<Button onClick={() => setShowFilterCreationModale(true)} highlighted={wallModel.appliedFilters.length > 0}>
				<FilterIcon classList={{ [styles['filter-icon']]: true }} />
			</Button>
			<Show when={showFilterCreationModale()}>
				<FiltersEditionModale onClose={() => setShowFilterCreationModale(false)} />
			</Show>
		</>
	)
}
