
import { useArtworksMemo } from "../../../../../context/ArtworksDBProvider"
import { useWallModel } from "../../../../../context/WallModelProvider"
import { type Option, Select } from "../../../../../design-system/Select/Select"
import type { AppliedFilterOnYear } from "../../../../../model/wall/Filter"
import { FilterPanel } from "./FilterPanel"


export const YearFilterPanel = () => {

    const { wallModel, operations: { setFilter } } = useWallModel()

    const yearFilter: () => AppliedFilterOnYear = () => wallModel.appliedFilters.find((filter) => filter.on === 'year')
        ?? {
        on: 'year',
        value: {
            min: Number.MIN_SAFE_INTEGER,
            max: Number.MAX_SAFE_INTEGER
        }
    }

    const setMin = (min: number) => setFilter({ on: 'year', value: { ...yearFilter().value, min } })
    const setMax = (max: number) => setFilter({ on: 'year', value: { ...yearFilter().value, max } })

    return <FilterPanel filterType="year" title="Year">
        Created after <YearSelector value={yearFilter().value.min} onChange={setMin} />
        and before <YearSelector value={yearFilter().value.max} onChange={setMax} />
    </FilterPanel>
}

type YearSelectorProps = {
    value: number
    onChange: (value: number) => void
}
const YearSelector = (props: YearSelectorProps) => {
    const artworksMemo = useArtworksMemo()

    const yearsOptions = (): Option[] => {
        function* f() {
            yield Number.MIN_SAFE_INTEGER
            let y = artworksMemo.year.min;
            while (y < artworksMemo.year.max) {
                yield y
                y++
            }
            yield Number.MAX_SAFE_INTEGER
        }
        return Array.from(f()).map(year => ({ value: year.toString(), label: yearDisplay(year) }))
    }

    const yearDisplay = (year: number) => {
        switch (year) {
            case Number.MIN_SAFE_INTEGER: return "Distant past";
            case Number.MAX_SAFE_INTEGER: return "Distant future";
            default:
                return year.toString()
        }
    }

    return <Select
        value={props.value.toString()}
        onChange={(value) => props.onChange(Number.parseInt(value, 10))}
        options={yearsOptions()}
    />
}