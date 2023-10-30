import { SiteConfiguration } from '../../src/scripts/lib/SiteConfiguration/SiteConfiguration'

export const config: SiteConfiguration = {
    extraction: {
        sheetId: '1xBYqjQpYiq0765Ftt3hRCo4qQFugmFchQA-78LnvWnM',
        firstDataRow: 2,
        columns: {
            A: { fieldName: 'reference', type: 'id' },
            B: { type: 'publish' },
            C: { fieldName: 'category', type: 'tags' },
            D: { fieldName: 'availability', type: 'enum' },
            E: { fieldName: 'title', type: 'text' },
            F: { fieldName: 'year', type: 'number' },
            G: { fieldName: 'width', type: 'number', subtype: 'length' },
            H: { fieldName: 'height', type: 'number', subtype: 'length' },
            I: { fieldName: 'depth', type: 'number', subtype: 'length' },
            J: { fieldName: 'technic', type: 'tags' },
            K: { fieldName: 'misc', type: 'text' },
            L: { fieldName: 'image', type: 'visual' }
        }
    },
    i18n: {
        fr: {
            title: 'Roger Payen',
            fields: {
                reference: 'référence',
                category: 'catégorie',
                availability: 'disponibilité',
                title: 'titre',
                year: 'année',
                width: 'largeur',
                height: 'hauteur',
                depth: 'profondeur',
                technic: 'technique',
                misc: 'information additionnelle',
                image: 'image'
            }
        },
        en: {
            title: 'Roger Payen',
            fields: {
                reference: 'reference',
                category: 'category',
                availability: 'availability',
                title: 'title',
                year: 'year',
                width: 'width',
                height: 'height',
                depth: 'depth',
                technic: 'technic',
                misc: 'additional informations',
                image: 'image'
            }
        }
    }
}
