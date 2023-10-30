import { Artwork } from '~common/Artwork'
import { AllColumnsDefinition } from '../SiteConfiguration/SiteConfiguration'
import { ArtworkFields, ArtworksDatabase } from '~common/ArtworksDatabase'
import { NormalColumnDefinition } from '../SiteConfiguration/ColumnDefinition'

export const writeArtworksDatabase = async (
    artworksFile: string,
    artworks: Artwork[],
    columnDefinitions: AllColumnsDefinition
) => {
    const artworksDB: ArtworksDatabase = {
        fields: makeFields(artworks, columnDefinitions),
        artworks
    }
    await Bun.write(artworksFile, JSON.stringify(artworksDB, undefined, '\t'))
}

const makeFields = (
    artworks: Artwork[],
    columnDefinitions: AllColumnsDefinition
): ArtworkFields =>
    Object.fromEntries(
        (
            Object.values(columnDefinitions).filter(
                ({ type }) => type !== 'publish'
            ) as NormalColumnDefinition[]
        ).map(({ fieldName, ...field }) => [fieldName, field])
    )
