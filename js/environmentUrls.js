import { siteEnvironmentMapping } from '../data/siteEnvironmentMapping.js'

// The expected site format is "ncoi-nl" or "mbo-nl"
export function getEnvironmentUrls(site, subdomainToAttach = "") {
    const siteMapping = siteEnvironmentMapping[site]

    if (!siteMapping) {
        return null
    }
    
    return siteMapping
}

export function getEnvironmentUrl(site, environment, subdomainToAttach = "") {
    const siteUrls = getEnvironmentUrls(site, subdomainToAttach)

    if (!siteUrls) {
        return null
    }

    return siteUrls[environment]
}