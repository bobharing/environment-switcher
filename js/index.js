import { getSite, getPath } from './matchUrls.js'
import { getEnvironmentUrls } from './environmentUrls.js'

// Obtain current tab info
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const targetDiv = document.querySelector("#js-page-url")
    const activeTabUrl = tabs[0]?.url
    
    const siteEnvironmentUrls = getEnvironmentUrls(getSite(activeTabUrl))

    for (const item in siteEnvironmentUrls) {
        const button = createEnvironmentButton(siteEnvironmentUrls[item])

        const path = getPath(activeTabUrl)

        const buttonUrl = "https://" + siteEnvironmentUrls[item] + path

        setButtonEvent(button, buttonUrl, tabs[0].id)

        targetDiv.appendChild(button)
    }
})

const createEnvironmentButton = (text) => {
    const btnWrapper = document.createElement("div")
    btnWrapper.classList.add("c-button-environment")

    const btn = document.createElement("button")
    btn.classList.add("c-button")
    btn.insertAdjacentText("beforeend", text)

    return btnWrapper.appendChild(btn)
}

// Setup event for environment button click + sendmessage to content script to navigate to url
const setButtonEvent = (button, buttonurl, tabId) => {
    button.addEventListener("click", event => {
        event.preventDefault()

        // Handle ctrl + click
        if (event.ctrlKey) {
            window.open(buttonurl, "_blank")
            window.close()
            return
        }

        chrome.tabs.sendMessage(
            tabId,
            {
                url: buttonurl
            }
        )
        
        window.close()
    })
}