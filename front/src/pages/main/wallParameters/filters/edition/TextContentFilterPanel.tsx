import { useWallModel } from '@context/wall/WallModelProvider'
import type { AppliedFilterOnTextContent } from '@model/wall/AppliedFilter'
import { debounce } from '../../../../../util/debounce'
import { FilterPanel } from './FilterPanel'

export const TextContentFilterPanel = () => {
	const {
		wallModel,
		operations: { setFilter, removeFilter },
	} = useWallModel()

	const filterValue = () =>
		wallModel.appliedFilters.find(({ on }) => on === 'textContent') as AppliedFilterOnTextContent | undefined

	return (
		<FilterPanel title="Title or description" filterType="textContent">
			contains{' '}
			<input
				type="search"
				placeholder="text present in either title either description"
				value={filterValue()?.value.contains ?? ''}
				onInput={debounce(({ target: { value } }) => {
					if (value.length) {
						setFilter({ on: 'textContent', value: { contains: value } })
					} else {
						removeFilter('textContent')
					}
				})}
			/>
		</FilterPanel>
	)
}
