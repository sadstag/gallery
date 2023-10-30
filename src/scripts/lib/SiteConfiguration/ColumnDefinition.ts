import { ArtworkField } from '~common/ArtworkField'

export type ColumnDefinition = PublishColumnDefinition | NormalColumnDefinition

type PublishColumnDefinition = {
    type: 'publish'
}

export type NormalColumnDefinition = BaseColumnDefinition & ArtworkField

type BaseColumnDefinition = {
    fieldName: string
}
