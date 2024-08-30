
import { useWallModel } from "../../../../../context/wall/WallModelProvider"
import { ToggleSwitch } from "../../../../../design-system/ToggleSwitch/ToggleSwitch"
import { FilterPanel } from "./FilterPanel"


export const HiddenAtFirstFilterPanel = () => {

    const { wallModel, operations: { setFilter, removeFilter } } = useWallModel()

    const isSet = () => wallModel.appliedFilters.find((filter) => filter.on === 'hideArtworksHiddenAtFirst') !== undefined

    const handleChange = (value: boolean) => {
        if (value) {
            setFilter({ on: 'hideArtworksHiddenAtFirst', value: { mustBeTrue: true } })
        } else {
            removeFilter('hideArtworksHiddenAtFirst')
        }
    }

    return <FilterPanel filterType="hideArtworksHiddenAtFirst" title="Artworks hidden by default">
        <ToggleSwitch value={isSet()} onChange={handleChange} />keep them hidden
    </FilterPanel>
}