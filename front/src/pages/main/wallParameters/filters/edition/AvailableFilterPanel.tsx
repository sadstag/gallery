
import { } from "solid-js"
import { useWallModel } from "../../../../../context/WallModelProvider"
import { ToggleSwitch } from "../../../../../design-system/ToggleSwitch/ToggleSwitch"
import { FilterPanel } from "./FilterPanel"


export const AvailableFilterPanel = () => {

    const [{ appliedFilters }, { setFilter, removeFilter }] = useWallModel()

    const isSet = () => appliedFilters.find((filter) => filter.on === 'available') !== undefined

    const handleChange = (value: boolean) => {
        if (value) {
            setFilter({ on: 'available', value: { mustBeTrue: true } })
        } else {
            removeFilter('available')
        }
    }

    return <FilterPanel filterType="available" title="Availability">
        <ToggleSwitch value={isSet()} onChange={handleChange} /> show only artworks I can purchase
    </FilterPanel>
}