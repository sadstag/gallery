import { useWallModel } from "../../../../../context/WallModelProvider"
import type { AppliedFilterOnTextContent } from "../../../../../model/wall/Filter"
import { debounce } from "../../../../../util/debounce"
import { FilterPanel } from "./FilterPanel"

export const TextContentFilterPanel = () => {

    const [{ appliedFilters }, _, _2, { setFilter, removeFilter }] = useWallModel()

    const filterValue = () => appliedFilters.find(({ on }) => on === 'textContent') as AppliedFilterOnTextContent | undefined

    return <FilterPanel title="Title or description" filterType="textContent">
        contains <input type="search"
            placeholder="text present in either title either description"
            value={filterValue()?.value.contains ?? ""}
            onInput={debounce(({ target: { value } }) => {
                if (value.length) {
                    setFilter({ on: 'textContent', value: { contains: value } })
                } else {
                    removeFilter('textContent')
                }
            })}
        />
    </FilterPanel>
}