import { MESSAGE } from "../src/Message.mjs"

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get('scripts', (res) => {
        console.log("Initial Storage", res)
    })
})


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let response = {message: ''}

    if (request.message === MESSAGE.SCRIPT_LOADED) {
        handleLoadedScript(request)
        response.message = "Script loaded"
    }

    sendResponse(response)
})

async function handleLoadedScript(request) {
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
            console.log("PREV SCRIPTS", scripts)
            scripts.push(data)
            console.log("UPDATED SCRIPTS", scripts)
            chrome.storage.local.set({['scripts']: scripts}, () => {
                resolve()
            })
        })
    })
}