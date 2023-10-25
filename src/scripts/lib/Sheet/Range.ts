import {
    ColumnId,
    columnIdIsValid,
    strictlyLessThan
} from '../SiteConfiguration/ColumnId'
import { AllColumnsDefinition } from '../SiteConfiguration/SiteConfiguration'

type RangeString = string

type Range = { min: ColumnId; max: ColumnId }

const reasonableMinColumnId = 'A'
const reasonableMaxColumnId = 'Z'.repeat(4)

export const computeRangeString = (
    columns: AllColumnsDefinition,
    firstDataRow: number
): RangeString => {
    const { min, max } = computeRange(columns)
    return `${min}${firstDataRow}:${max}`
}

export const computeRange = (columns: AllColumnsDefinition): Range => {
    const columnIds = Object.keys(columns)

    if (columnIds.length === 0) {
        throw new Error('computeRange called on no columns')
    }

    const invalidColumnId = columnIds.find((colId) => !columnIdIsValid(colId))
    if (invalidColumnId) {
        throw new Error(
            `computeRange called on columns with some incorrect column IDs "${invalidColumnId}"`
        )
    }

    return columnIds.reduce(
        ({ min, max }, columnId) => ({
            min: strictlyLessThan(columnId, min) ? columnId : min,
            max: strictlyLessThan(max, columnId) ? columnId : max
        }),
        {
            // intentionaly inverted here (reducer initialization)
            min: reasonableMaxColumnId,
            max: reasonableMinColumnId
        }
    )
}
