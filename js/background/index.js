import { getEnvironment, isActive } from '../matchUrls.js'
import { environments } from '../../data/siteEnvironmentMapping.js'

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Disable if is not an url meant for the extension
    disableExtension(tab)

    // Add environment badge
    setEnvironmentBadge(tab)
})

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        // Disable if is not an url meant for the extension
        disableExtension(tab)

        // Add environment badge
        setEnvironmentBadge(tab)
    })
})

const setEnvironmentBadge = tab => {
    let environment = getEnvironment(tab.url)

    let badgeColor = "#000"

    switch (environment) {
        case environments.prd:
            badgeColor = "#ff0000"
            break;
        case environments.acc:
            badgeColor = "#002BC6"
            break;
        case environments.tst:
        case environments.dev:
            badgeColor = "#00ab66"
            break;
        default:
            badgeColor = "#000"
    }
    
    chrome.browserAction.setBadgeText({tabId: tab.id, text: environment})
    chrome.browserAction.setBadgeBackgroundColor({color: badgeColor})
}

const disableExtension = (tab) => {
    if (!isActive(tab.url)) {
        chrome.browserAction.setIcon({ path: "../../icons/swap128x128-no-match.png"})

        chrome.browserAction.disable(tab.id)
    } else {
        chrome.browserAction.setIcon({ path: "../../icons/swap128x128.png"})
    }
}