import { AllColumnsDefinition } from '../SiteConfiguration/SiteConfiguration'
import { Extract, Row } from '../Sheet/sheet'
import { ColumnId, nextColId } from '../SiteConfiguration/ColumnId'
import { computeRange } from '../Sheet/Range'
import { Artwork } from '~common/Artwork'

export const buildArtworks = (
    extract: Extract,
    colDefs: AllColumnsDefinition,
    firstDataRow: number
): Artwork[] => {
    const { min } = computeRange(colDefs)

    return extract
        .map(buildArtwork(colDefs, min, firstDataRow))
        .filter((artwork) => artwork !== 'ignored') as Artwork[]
}

const buildArtwork =
    (
        colDefs: AllColumnsDefinition,
        minColumnId: ColumnId,
        firstDataRow: number
    ) =>
    (row: Row, rowIndex: number): Artwork | 'ignored' => {
        const artwork: Artwork = {
            _meta: { sourceRow: rowIndex + firstDataRow }
        }
        let colId = minColumnId

        for (const cellValue of row) {
            if (!(colId in colDefs)) {
                // column is ignored by definition
                continue
            }

            const { [colId]: colDef } = colDefs

            if (colDef.type === 'publish') {
                if (cellValue !== 'TRUE') {
                    return 'ignored'
                }
            } else {
                artwork[colDef.fieldName] = cellValue
            }

            colId = nextColId(colId)
        }
        return artwork
    }
