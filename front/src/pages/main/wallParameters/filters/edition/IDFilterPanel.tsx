import { useWallModel } from '@context/wall/WallModelProvider'
import type { AppliedFilterOnId } from '@model/wall/Filter'
import { debounce } from '../../../../../util/debounce'
import { FilterPanel } from './FilterPanel'

export const IdFilterPanel = () => {
	const {
		wallModel,
		operations: { setFilter },
	} = useWallModel()

	const filterValue = () => wallModel.appliedFilters.find(({ on }) => on === 'id') as AppliedFilterOnId | undefined

	return (
		<FilterPanel title="Reference" filterType="id">
			contains{' '}
			<input
				type="text"
				placeholder="text present in the reference number"
				value={filterValue()?.value.contains ?? ''}
				onInput={debounce(({ target: { value } }) => {
					setFilter({ on: 'id', value: { contains: value } })
				})}
			/>
		</FilterPanel>
	)
}
