import { Artwork } from './Artwork'
import { ArtworkField } from './ArtworkField'

export type ArtworksDatabase = {
    fields: ArtworkFields
    artworks: Artwork[]
}

export type ArtworkFields = {
    [fieldName: string]: ArtworkField
}
