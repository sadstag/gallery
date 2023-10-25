import { Outcome } from '../Outcome'
import { computeRangeString } from './Range'
import { ExtractionConfiguration } from '../SiteConfiguration/SiteConfiguration'

export type Row = string[]
export type Extract = Row[]

type SheetValuesOutcome = Outcome<Extract>

export const buildSheetExtractor =
    (apiKey: string) =>
    async ({
        sheetId,
        firstDataRow,
        columns
    }: ExtractionConfiguration): Promise<SheetValuesOutcome> => {
        const range = computeRangeString(columns, firstDataRow)

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`

        try {
            const response = await fetch(url)

            const payload = await response.json()

            if (!response.ok) {
                return { outcome: 'error', message: payload.error.message }
            }

            return { outcome: 'success', data: payload.values }
        } catch (error) {
            return { outcome: 'error', message: (error as Error).message }
        }
    }
