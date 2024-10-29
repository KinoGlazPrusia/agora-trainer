import { MESSAGE } from "../src/Message.mjs"

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    let response = {message: ''}

    switch (request.message) {

        case MESSAGE.NAVIGATE_TO_TARGET:
            await handleTarget(request)
            response.message = "Navigated to target"
            break

        case MESSAGE.SCRIPT_LOADED:
            await handleLoadedScript(request)
            response.message = "Script loaded"
            break
    }

    sendResponse(response)
})

async function handleLoadedScript(request) {
    //clearStorage()

    try {
        if (await storageIsEmpty()) {
            await initializeStorage('scripts', [request.data])
        } 
        else {
            await addScript(request.data)
        }

        chrome.storage.local.get('scripts', (res) => {
            console.log("Storage", res)
        })
    } 
    
    catch (error) {
        console.error(error)
    }
}

async function handleTarget(request) {
    await navigateFromTo(request.data.current, request.data.target)
}

async function navigateFromTo(current, target) {
    return new Promise(resolve => {
        chrome.tabs.update(current, {url: target}, () => {
            const contentLoadedListener = (tabId, changeInfo, tab) => {
                if (tab.id === current && changeInfo.status === "complete") {
                    console.log("Tab updated", tab)
                    chrome.tabs.onUpdated.removeListener(contentLoadedListener)
                    resolve()
                }
            }
            chrome.tabs.onUpdated.addListener(contentLoadedListener)
        })
    })
}

async function storageIsEmpty() {
    let isEmpty = false

    return new Promise(resolve => {
        chrome.storage.local.get(null, (res) => {
            if (Object.keys(res).length === 0) {
                isEmpty = true
            }
            resolve(isEmpty)
        })
    })
}

async function initializeStorage(key, value) {
    return new Promise(resolve => {
        chrome.storage.local.set({[key]: value}, () => {
            resolve()
        })
    })
}

async function addScript(data) {
    return new Promise(resolve => {
        chrome.storage.local.get(['scripts'], (res) => {
            const scripts = res.scripts
            scripts.push(data)
            chrome.storage.local.set({['scripts']: scripts}, () => {
                resolve()
            })
        })
    })
}

function clearStorage() {
    chrome.storage.local.clear()
}
