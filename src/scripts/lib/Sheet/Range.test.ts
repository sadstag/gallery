import { expect, test, describe } from 'bun:test'
import { AllColumnsDefinition } from '../SiteConfiguration/SiteConfiguration'
import { computeRangeString } from './Range'
import { ColumnDefinition } from '../SiteConfiguration/ColumnDefinition'

type TestExpectation = 'failure' | { range: string }

const colDef: ColumnDefinition = { fieldName: 'whatever', type: 'id' }

const tests: [AllColumnsDefinition, number, TestExpectation][] = [
    [{}, 0, 'failure'],
    [{ a: colDef }, 0, 'failure'],
    [{ A: colDef }, 1, { range: 'A1:A' }],
    [{ A: colDef, B: colDef }, 2, { range: 'A2:B' }],
    [{ AA: colDef, A: colDef }, 10, { range: 'A10:AA' }],
    [{ B: colDef, Z: colDef, A: colDef }, 1, { range: 'A1:Z' }]
]

describe('computeRange', () => {
    for (const [columns, firstDataRow, expectation] of tests) {
        if (expectation === 'failure') {
            test(`computeRangeString(column definitions for column ids [${Object.keys(
                columns
            )}], ${firstDataRow}) fails`, () => {
                expect(() =>
                    computeRangeString(columns, firstDataRow)
                ).toThrow()
            })
        } else {
            test(`computeRangeString(column definitions for volumn ids [${Object.keys(
                columns
            )}], ${firstDataRow}) === ${expectation.range}`, () => {
                expect(computeRangeString(columns, firstDataRow)).toBe(
                    expectation.range
                )
            })
        }
    }
})
