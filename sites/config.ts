import { config as rpConfig } from './rp/config'

const siteConfigurations = {
    rp: rpConfig
    // Add/Replace with other site configuration
}

export const getSiteConfiguration = (siteId: string) => {
    if (!(siteId in siteConfigurations)) {
        console.error(`Missing site configuration for site id '${siteId}'`)
        process.exit(3)
    }

    return siteConfigurations[siteId as keyof typeof siteConfigurations]
}
