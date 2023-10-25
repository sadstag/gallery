import { ColumnDefinition } from './ColumnDefinition'
import { ColumnId } from './ColumnId'

export type AllColumnsDefinition = {
    [columnId: ColumnId]: ColumnDefinition
}

export type ExtractionConfiguration = {
    sheetId: string
    firstDataRow: number
    columns: AllColumnsDefinition
}

export type SiteConfiguration = {
    extraction: ExtractionConfiguration
    i18n: I18n
}

export type Translations = { [k: string]: TranslationValue }

type TranslationValue = string | Translations

export type MandatoriesTranslations = {
    title: string
    fields: {
        [fieldName: string]: string
    }
}

export type I18n = {
    [lang: string]: MandatoriesTranslations & Translations
}
