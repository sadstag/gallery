import {
    EnumFieldDefinition,
    IdFieldDefinition,
    NumberFieldDefinition,
    TagsFieldDefinition,
    TextFieldDefinition,
    VisualURLFieldDefinition
} from '~common/ArtworkField'

/**
 * Field definition with possible properties coming from the inspection of the set of all artworks
 */
export type EnrichedArtworkField =
    | IdEnrichedFieldDefinition
    | TextEnrichedFieldDefinition
    | NumberEnrichedFieldDefinition
    | EnumEnrichedFieldDefinition
    | TagsEnrichedFieldDefinition
    | VisualURLEnrichedFieldDefinition

export type IdEnrichedFieldDefinition = IdFieldDefinition

export type TextEnrichedFieldDefinition = TextFieldDefinition

export type NumberEnrichedFieldDefinition = NumberFieldDefinition

export type EnumEnrichedFieldDefinition = EnumFieldDefinition & {
    values: string[]
}

export type TagsEnrichedFieldDefinition = TagsFieldDefinition & {
    values: string[]
}

export type VisualURLEnrichedFieldDefinition = VisualURLFieldDefinition
