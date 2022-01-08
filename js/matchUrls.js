import { environmentUrls, environments } from "../data/siteEnvironmentMapping.js"

// TODO if possible let's refactor all of this to a "simple" regex
// Returns either: tst, acc or prd
export function getEnvironment(url) {
    // Match only urls with evi.cloud in them
    const regexpEviCloud = /.+?(?=\.evi\.cloud)/
    let host = url.match(regexpEviCloud)

    // It might be a prd url.
    if (!host) {

        // TODO refactor this, it's not strict enough
        host = environmentUrls.map(item => item.replace("-",".")).find(domain => {
            return url.indexOf(domain) !== -1
        })  

        // TODO refactor this, it's not strict enough
        // ok maybe it's develop
        if (!host) {
            return url.indexOf(".develop") !== -1 ? environments.dev : null
        }

        return host ? environments.prd : null
    }

    const regexpEnvironment = /tst|acc|prd/
    const environment = environments[host[0].match(regexpEnvironment)[0]]

    return environment
} 

export function isActive(url) {
    return getEnvironment(url) && getSite(url)
}

export function getPath(url) {
    // Long John da MVP
    const parser = document.createElement('a')
    parser.href = url

    return parser.pathname + parser.search + parser.hash
}

// Returns the site in the following format (ncoi-nl)
export function getSite(url) {
    let site = environmentUrls.find(siteItem => {
        return url.indexOf(siteItem) !== -1
    })

    if (!site) {
        site = environmentUrls.find(domain => {
            return url.indexOf(domain.replace("-",".")) !== -1
        })
    }
    return site
}