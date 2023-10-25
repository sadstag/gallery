/**
 * A column id is a column name in a google spreadsheet
 * it is A to Z, then AA to AZ, then BA to BZ, ... AAA to ZZZ
 */
export type ColumnId = string

const ValidColumnIdRegexp = /^[A-Z]+$/

export const columnIdIsValid = RegExp.prototype.test.bind(ValidColumnIdRegexp)

export const strictlyLessThan = (
    colId1: ColumnId,
    colId2: ColumnId
): boolean => {
    if (colId1.length < colId2.length) return true
    if (colId1.length > colId2.length) return false

    return arrStrictlyLessThan(colId1.split(''), colId2.split(''))
}

const arrStrictlyLessThan = (
    [first1, ...rest1]: string[],
    [first2, ...rest2]: string[]
): boolean => {
    if (first1 === undefined || first2 === undefined) return false

    const cc1 = first1.charCodeAt(0)
    const cc2 = first2.charCodeAt(0)

    if (cc1 < cc2) return true
    if (cc1 > cc2) return false

    return arrStrictlyLessThan(rest1, rest2)
}

export const nextColId = (colId: ColumnId): ColumnId => {
    if (!columnIdIsValid(colId)) {
        throw new Error('invalid column Id')
    }

    return nextColIdArrRev(colId.split('').reverse()).reverse().join('')
}

const nextColIdArrRev = (colIdArr: string[]): string[] => {
    const [lowChar, ...rest] = colIdArr

    if (lowChar === undefined) {
        // happens when we go from a N characters column ID to a N+A column ID
        // ex : next('Z') = 'AA'
        return ['A']
    }

    if (lowChar === 'Z') {
        // just cycling to A and let the remaining of the colID pass to the next value
        return ['A', ...nextColIdArrRev(rest)]
    }

    // most of the case : the lower char does not overflow, just adding 1
    return [String.fromCharCode(lowChar.charCodeAt(0) + 1), ...rest]
}
