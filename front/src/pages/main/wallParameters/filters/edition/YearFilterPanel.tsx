
import { Index, } from "solid-js"
import { useArtworksMemo } from "../../../../../context/ArtworksDBProvider"
import { useWallModel } from "../../../../../context/WallModelProvider"
import type { AppliedFilterOnYear } from "../../../../../model/wall/Filter"
import { FilterPanel } from "./FilterPanel"


export const YearFilterPanel = () => {

    const [{ appliedFilters }, { setFilter }] = useWallModel()

    const yearFilter: () => AppliedFilterOnYear = () => appliedFilters.find((filter) => filter.on === 'year')
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

    const years = () => {
        function* f() {
            yield Number.MIN_SAFE_INTEGER
            let y = artworksMemo.year.min;
            while (y < artworksMemo.year.max) {
                yield y
                y++
            }
            yield Number.MAX_SAFE_INTEGER
        }
        return Array.from(f())
    }


    const yearDisplay = (year: number) => {
        switch (year) {
            case Number.MIN_SAFE_INTEGER: return "Distant past";
            case Number.MAX_SAFE_INTEGER: return "Distant future";
            default:
                return year
        }
    }

    return <select value={props.value} onChange={(e) => props.onChange(Number.parseInt(e.target.value, 10))}>
        <Index each={years()}>{(year) => <option value={year()}>{yearDisplay(year())}</option>}</Index>
    </select>
}