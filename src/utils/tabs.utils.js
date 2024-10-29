export async function getCurrentTabId() {
    const currentTab = await chrome.tabs.query({active: true, currentWindow: true})
    return currentTab[0].id
}

export async function getCurrentTabUrl() {
    const currentTab = await chrome.tabs.query({active: true, currentWindow: true})
    return currentTab[0].url
}