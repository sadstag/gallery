export type ArtworkField =
    | IdFieldDefinition
    | TextFieldDefinition
    | NumberFieldDefinition
    | EnumFieldDefinition
    | TagsFieldDefinition
    | VisualURLFieldDefinition

export type IdFieldDefinition = {
    type: 'id'
}

export type TextFieldDefinition = {
    type: 'text'
}

export type NumberFieldDefinition = {
    type: 'number'
    subtype?: 'length'
}

export type EnumFieldDefinition = {
    type: 'enum'
}

export type TagsFieldDefinition = {
    type: 'tags'
}

export type VisualURLFieldDefinition = {
    type: 'visual'
}
