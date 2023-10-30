import { expect, test, describe } from 'bun:test'
import { computeRangeString } from '../Sheet/Range'
import {
    AllColumnsDefinition,
    ExtractionConfiguration,
    I18n
} from './SiteConfiguration'
import { checkSiteConfiguration } from './check'

const minimalValidColumns: AllColumnsDefinition = {
    A: { fieldName: 'myIdField', type: 'id' },
    B: { type: 'publish' },
    C: { type: 'visual', fieldName: 'myVisualField' }
}

const minimalValidExtraction: ExtractionConfiguration = {
    sheetId: 'Foo',
    firstDataRow: 1,
    columns: minimalValidColumns
}

const minimalFieldsI18n = { myIdField: 'foo', myVisualField: 'bar' }

const minimalValidI18n: I18n = {
    en: { title: 'a title', fields: minimalFieldsI18n }
}

describe('checkSiteConfiguration', () => {
    describe('extraction', () => {
        test('sheetId should be non-empty', () => {
            expect(
                checkSiteConfiguration({
                    extraction: {
                        sheetId: '',
                        firstDataRow: 1,
                        columns: minimalValidColumns
                    },
                    i18n: minimalValidI18n
                })
            ).toEqual(['sheetId is empty'])
        })

        test('firstDataRow === 0 is invalid', () => {
            expect(
                checkSiteConfiguration({
                    extraction: {
                        sheetId: 'Foo',
                        firstDataRow: 0,
                        columns: minimalValidColumns
                    },
                    i18n: minimalValidI18n
                })
            ).toEqual([
                'Invalid firstDataRow (0): should be greater than or equal to 1'
            ])
        })

        test('firstDataRow === 1 is valid', () => {
            expect(
                checkSiteConfiguration({
                    extraction: {
                        sheetId: 'Foo',
                        firstDataRow: 1,
                        columns: minimalValidColumns
                    },
                    i18n: minimalValidI18n
                })
            ).toEqual([])
        })

        test('all column IDs should be valid', () => {
            expect(
                checkSiteConfiguration({
                    extraction: {
                        sheetId: 'Foo',
                        firstDataRow: 1,
                        columns: {
                            a: { type: 'id', fieldName: 'ref' },
                            B: { type: 'publish' },
                            C: { type: 'visual', fieldName: 'foo' }
                        }
                    },
                    i18n: minimalValidI18n
                })
            ).toEqual(['Invalid column id "a"'])
        })

        test('there cannot be 0 column of type "id"', () => {
            expect(
                checkSiteConfiguration({
                    extraction: {
                        sheetId: 'Foo',
                        firstDataRow: 1,
                        columns: {
                            A: { type: 'publish' },
                            B: { type: 'visual', fieldName: 'foo' }
                        }
                    },
                    i18n: minimalValidI18n
                })
            ).toEqual(['There should be one column of type "id"'])
        })

        test('there cannot be more than 1 column of type "id"', () => {
            expect(
                checkSiteConfiguration({
                    extraction: {
                        sheetId: 'Foo',
                        firstDataRow: 1,
                        columns: {
                            A: { type: 'publish' },
                            B: { type: 'id', fieldName: 'ref' },
                            C: { type: 'id', fieldName: 'ref2' },
                            D: { type: 'visual', fieldName: 'foo' }
                        }
                    },
                    i18n: minimalValidI18n
                })
            ).toEqual(['There should be no more than one column of type "id"'])
        })

        test('there cannot be 0 column of type "publish"', () => {
            expect(
                checkSiteConfiguration({
                    extraction: {
                        sheetId: 'Foo',
                        firstDataRow: 1,
                        columns: {
                            A: { type: 'id', fieldName: 'ref' },
                            B: { type: 'visual', fieldName: 'foo' }
                        }
                    },
                    i18n: minimalValidI18n
                })
            ).toEqual(['There should be one column of type "publish"'])
        })

        test('there cannot be more than 1 column of type "publish"', () => {
            expect(
                checkSiteConfiguration({
                    extraction: {
                        sheetId: 'Foo',
                        firstDataRow: 1,
                        columns: {
                            A: { type: 'id', fieldName: 'ref' },
                            B: { type: 'publish' },
                            C: { type: 'publish' },
                            D: { type: 'visual', fieldName: 'foo' }
                        }
                    },
                    i18n: minimalValidI18n
                })
            ).toEqual([
                'There should be no more than one column of type "publish"'
            ])
        })

        test('there cannot be 0 column of type "visual"', () => {
            expect(
                checkSiteConfiguration({
                    extraction: {
                        sheetId: 'Foo',
                        firstDataRow: 1,
                        columns: {
                            A: { type: 'id', fieldName: 'ref' },
                            B: { type: 'publish' }
                        }
                    },
                    i18n: minimalValidI18n
                })
            ).toEqual(['There should be one column of type "visual"'])
        })

        test('there cannot be more than 1 column of type "publish"', () => {
            expect(
                checkSiteConfiguration({
                    extraction: {
                        sheetId: 'Foo',
                        firstDataRow: 1,
                        columns: {
                            A: { type: 'id', fieldName: 'ref' },
                            B: { type: 'publish' },
                            C: { type: 'visual', fieldName: 'foo' },
                            D: { type: 'visual', fieldName: 'foo2' }
                        }
                    },
                    i18n: minimalValidI18n
                })
            ).toEqual([
                'There should be no more than one column of type "visual"'
            ])
        })

        test('Field names must be unique', () => {
            expect(
                checkSiteConfiguration({
                    extraction: {
                        sheetId: 'Foo',
                        firstDataRow: 1,
                        columns: {
                            A: { type: 'id', fieldName: 'notUnique' },
                            B: { type: 'publish' },
                            C: { type: 'visual', fieldName: 'notUnique' }
                        }
                    },
                    i18n: minimalValidI18n
                })
            ).toEqual(['Field names must be unique'])
        })
    })

    describe('i18n', () => {
        test('at least one language', () => {
            expect(
                checkSiteConfiguration({
                    extraction: minimalValidExtraction,
                    i18n: {}
                })
            ).toEqual(['i18n section should contains at least one language'])
        })

        test('every language code should be valid', () => {
            expect(
                checkSiteConfiguration({
                    extraction: minimalValidExtraction,
                    i18n: {
                        'not-a-language': {
                            title: 'foo',
                            fields: minimalFieldsI18n
                        }
                    }
                })
            ).toEqual(['language code "not-a-language" is invalid'])
        })

        test('title should not be empty', () => {
            expect(
                checkSiteConfiguration({
                    extraction: minimalValidExtraction,
                    i18n: { fr: { title: '', fields: minimalFieldsI18n } }
                })
            ).toEqual(['title should not be empty for language "fr"'])
        })

        test('title should not be empty when trimmed', () => {
            expect(
                checkSiteConfiguration({
                    extraction: minimalValidExtraction,
                    i18n: { fr: { title: ' ', fields: minimalFieldsI18n } }
                })
            ).toEqual(['title should not be empty for language "fr"'])
        })

        test('all columns should be translated', () => {
            expect(
                checkSiteConfiguration({
                    extraction: minimalValidExtraction,
                    i18n: { fr: { title: 'foo', fields: {} } }
                })
            ).toEqual([
                'fields translations should match declared fields in extraction.columns for language "fr" (myVisualField,myIdField)'
            ])
        })
    })
})

describe('multi error cases', () => {
    test('a case with lots of basic errors', () => {
        expect(
            checkSiteConfiguration({
                extraction: { sheetId: '', firstDataRow: 0, columns: {} },
                i18n: { 'not a lang': { title: '', fields: {} } }
            })
        ).toEqual([
            'sheetId is empty',
            'Invalid firstDataRow (0): should be greater than or equal to 1',
            'There should be one column of type "id"',
            'There should be one column of type "publish"',
            'There should be one column of type "visual"'
        ])
    })

    test('a case with several of i18n errors', () => {
        expect(
            checkSiteConfiguration({
                extraction: minimalValidExtraction,
                i18n: { fr: { title: '', fields: { myVisualField: 'foo' } } }
            })
        ).toEqual([
            'title should not be empty for language "fr"',
            'fields translations should match declared fields in extraction.columns for language "fr" (myVisualField,myIdField)'
        ])
    })
})
