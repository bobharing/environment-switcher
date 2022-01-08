chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    window.location.assign(request.url)
})