import { expect, test } from 'bun:test'
import {
    ColumnId,
    columnIdIsValid,
    nextColId,
    strictlyLessThan
} from './ColumnId'

const validity_tests: [ColumnId, boolean][] = [
    ['', false],
    [' ', false],
    ['0', false],
    ['a', false],
    ['z', false],
    ['A', true],
    [' A', false],
    ['B', true],
    ['Z', true],
    ['A0', false],
    ['AA', true],
    [' AA', false],
    [' AA ', false],
    ['AA ', false],
    ['AB', true],
    ['AZ', true],
    ['BA', true],
    ['AAA', true]
]

for (const [colId, expectedResult] of validity_tests) {
    test(`columnIdIsValid("${colId}") === ${expectedResult}`, () => {
        expect(columnIdIsValid(colId)).toBe(expectedResult)
    })
}

const slt_tests: [ColumnId, ColumnId, boolean][] = [
    // nonsense, but tested
    ['', '', false],
    ['', 'A', true],

    // expected cases
    ['A', 'A', false],
    ['A', 'B', true],
    ['A', 'Z', true],
    ['A', 'AA', true],
    ['Z', 'AA', true],
    ['AA', 'AA', false],
    ['AA', 'AB', true],
    ['AZ', 'BA', true],
    ['ZZ', 'AAA', true],
    ['AZZ', 'BAA', true]
]

for (const [colId1, colId2, expectedResult] of slt_tests) {
    test(`strictlyLessThan("${colId1}", "${colId2}") === ${expectedResult}`, () => {
        expect(strictlyLessThan(colId1, colId2)).toBe(expectedResult)
    })

    if (colId1 !== colId2) {
        // antisymetry
        test(`strictlyLessThan("${colId2}", "${colId1}") === ${!expectedResult}`, () => {
            expect(strictlyLessThan(colId2, colId1)).toBe(!expectedResult)
        })
    }
}

const nextColId_tests: [ColumnId, 'fail' | ColumnId][] = [
    ['', 'failure'],
    [' ', 'failure'],
    ['1', 'failure'],
    ['a', 'failure'],
    ['A', 'B'],
    ['B', 'C'],
    ['Z', 'AA'],
    ['AA', 'AB'],
    ['AZ', 'BA'],
    ['ZZ', 'AAA'],
    ['AAA', 'AAB'],
    ['AAZ', 'ABA'],
    ['ABC', 'ABD'],
    ['AZA', 'AZB'],
    ['AZZ', 'BAA']
]

for (const [colId, expectedNextColId] of nextColId_tests) {
    if (expectedNextColId === 'failure') {
        test(`nextColId("${colId}") fails`, () => {
            expect(() => nextColId(colId)).toThrow()
        })
    } else {
        test(`nextColId("${colId}") === ${expectedNextColId}`, () => {
            expect(nextColId(colId)).toBe(expectedNextColId)
        })
    }
}
