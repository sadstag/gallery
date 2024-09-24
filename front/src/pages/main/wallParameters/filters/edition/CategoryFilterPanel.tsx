
import { type Option, Select } from "@ds/Select/Select"
import { useArtworksMemo } from "../../../../../context/ArtworksDBProvider"
import { useWallModel } from "../../../../../context/wall/WallModelProvider"
import type { AppliedFilterOnCategory, } from "../../../../../model/wall/Filter"
import { FilterPanel } from "./FilterPanel"


export const CategoryFilterPanel = () => {

    const { wallModel, operations: { setFilter } } = useWallModel()

    const filter: () => AppliedFilterOnCategory | undefined =
        () => wallModel.appliedFilters.find((filter) => filter.on === 'category')

    const artworksMemo = useArtworksMemo()

    const options: () => Option[] =
        () => artworksMemo.categories.map(category => ({ value: category, label: category }))

    return <FilterPanel filterType="category" title="Category">
        <Select
            value={filter()?.value.equals ?? ""}
            options={options()}
            onChange={
                (value) => setFilter({
                    on: 'category',
                    value: { equals: value }
                } as AppliedFilterOnCategory)
            }
        />
    </FilterPanel>
}
