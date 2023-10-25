import { ColumnDefinition } from './ColumnDefinition'
import { columnIdIsValid } from './ColumnId'
import {
    I18n,
    MandatoriesTranslations,
    SiteConfiguration
} from './SiteConfiguration'

type SiteConfigurationError = string
export const checkSiteConfiguration = (
    config: SiteConfiguration
): SiteConfigurationError[] => {
    const errors = [] as SiteConfigurationError[]
    const {
        extraction: { sheetId, firstDataRow, columns },
        i18n
    } = config

    if (sheetId.length === 0) {
        errors.push('sheetId is empty')
    }

    if (firstDataRow < 1) {
        errors.push(
            `Invalid firstDataRow (${firstDataRow}): should be greater than or equal to 1`
        )
    }

    const invalidColId = Object.keys(columns).find(
        (colId) => !columnIdIsValid(colId)
    )

    if (invalidColId) {
        errors.push(`Invalid column id "${invalidColId}"`)
    }

    const colDefs = Object.values(columns)

    errors.push(
        ...checkColUnicityUnicity('id', colDefs),
        ...checkColUnicityUnicity('publish', colDefs),
        ...checkColUnicityUnicity('visual', colDefs)
    )

    const fieldNames = colDefs.reduce(
        (namesList: string[], colDef: ColumnDefinition) => {
            if (colDef.type === 'publish') return namesList
            return [colDef.fieldName, ...namesList]
        },
        []
    )

    if (fieldNames.length !== new Set(fieldNames).size) {
        errors.push(`Field names must be unique`)
    }

    if (errors.length === 0) {
        // if we check i18n with more basic error found
        // this will lead user to confusion
        // let the user fix the basic errors first
        errors.push(...checkI18n(i18n, fieldNames))
    }

    return errors
}

const checkColUnicityUnicity = (
    colType: 'id' | 'publish' | 'visual',
    colDefs: ColumnDefinition[]
): SiteConfigurationError[] => {
    const errors = [] as SiteConfigurationError[]
    const count = colDefs.filter(({ type }) => type === colType).length
    switch (count) {
        case 0: {
            errors.push(`There should be one column of type "${colType}"`)
            break
        }
        case 1:
            break
        default:
            errors.push(
                `There should be no more than one column of type "${colType}"`
            )
    }
    return errors
}

// probably incorrect, but will do for a start
const validLanguageRegexp = /^[a-z]{2,3}(?:\-[a-z]{2,3})?$/

const checkI18n = (
    i18n: I18n,
    fieldNames: string[]
): SiteConfigurationError[] => {
    const errors = [] as SiteConfigurationError[]
    const langs = Object.keys(i18n)

    if (langs.length === 0) {
        errors.push('i18n section should contains at least one language')
    }

    const invalidLanguage = langs.find(
        (lang: string) => !validLanguageRegexp.test(lang)
    )
    if (invalidLanguage) {
        errors.push(`language code "${invalidLanguage}" is invalid`)
    }

    for (const lang of langs) {
        errors.push(...checkTranslations(i18n[lang], lang, fieldNames))
    }

    return errors
}

const checkTranslations = (
    mt: MandatoriesTranslations,
    language: string,
    fieldNames: string[]
): SiteConfigurationError[] => {
    const errors = [] as SiteConfigurationError[]
    if (mt.title.trim().length === 0) {
        errors.push(`title should not be empty for language "${language}"`)
    }

    const mtFieldNames = Object.keys(mt.fields)
    if (!fieldNamesAreEqual(fieldNames, mtFieldNames)) {
        errors.push(
            `fields translations should match declared fields in extraction.columns for language "${language}" (${fieldNames.join(
                ','
            )})`
        )
    }

    return errors
}

const fieldNamesAreEqual = (fn1: string[], fn2: string[]): boolean =>
    fieldNamesAreEqual_sorted([...fn1].sort(), [...fn2].sort())

const fieldNamesAreEqual_sorted = (fn1: string[], fn2: string[]): boolean => {
    if (fn1.length === 0 && fn2.length === 0) return true
    const [fn1head, ...fn1tail] = fn1
    const [fn2head, ...fn2tail] = fn2
    return fn1head === fn2head ? fieldNamesAreEqual(fn1tail, fn2tail) : false
}
