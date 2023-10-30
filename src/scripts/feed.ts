import parseArgs from 'minimist'
import process from 'node:process'

import { buildSheetExtractor } from './lib/Sheet/sheet'
import { readBuildConfiguration } from './lib/BuildConfiguration'
import { buildArtworks } from './lib/ArtworkDatabase/build'
import { getSiteConfiguration } from '../../sites/config'
import { writeArtworksDatabase } from './lib/ArtworkDatabase/write'
import { checkSiteConfiguration } from './lib/SiteConfiguration/check'

const args = parseArgs(process.argv.slice(2))

if (args._.length === 0) {
    console.error('Missing site configuration identifier')
    process.exit(1)
}

const siteId = args._[0]

const siteConfig = getSiteConfiguration(siteId)

const siteConfigErrors = checkSiteConfiguration(siteConfig)

if (siteConfigErrors.length) {
    console.error(`site configuration for '${siteId}' has errors :`)
    for (const error of siteConfigErrors) {
        console.error('\t- ' + error)
    }
    process.exit(2)
}

const config = await readBuildConfiguration()

const extractor = buildSheetExtractor(config.apiKey)

const extractionResult = await extractor(siteConfig.extraction)

if (extractionResult.outcome === 'error') {
    console.error(
        `could not read extract data from spreadsheet site id '${siteId}' : ${extractionResult.message}`
    )
    process.exit(3)
}

const artworks = buildArtworks(
    extractionResult.data,
    siteConfig.extraction.columns,
    siteConfig.extraction.firstDataRow
)

const artworksFile = `public/assets/artworks.json`

await writeArtworksDatabase(
    artworksFile,
    artworks,
    siteConfig.extraction.columns
)

console.info(`Wrote file ${artworksFile} !`)
