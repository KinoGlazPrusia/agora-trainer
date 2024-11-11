export class StorageAPI {
    async handleLoadedScript(data) {
        //this.clearStorage()
        console.log("Storage API: Loading script")
        try {
            if (await this.storageIsEmpty()) {
                await this.initializeStorage('scripts', [data])
            } 
            else {
                await this.addScript(data)
            }
    
            chrome.storage.local.get('scripts', (res) => {
                console.log("Storage", res)
            })
        } 
        
        catch (error) {
            console.error(error)
        }
    }

    async handleDeleteScript(name) {
        console.log("Storage API: Removing script")
        try {
            await this.removeScript(name)
        }

        catch (error) {
            console.error(error)
        }
    }

    async addScript(data) {
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

    async removeScript(name) {
        return new Promise(resolve => {
            chrome.storage.local.get(['scripts'], (res) => {
                const scripts = res.scripts
                const updatedScripts = scripts.filter(script => script.name !== name)
                chrome.storage.local.set({['scripts']: updatedScripts}, () => {
                    resolve()
                })
            })
        })
    } 

    async initializeStorage(key, value) {
        return new Promise(resolve => {
            chrome.storage.local.set({[key]: value}, () => {
                resolve()
            })
        })
    }

    clearStorage() {
        chrome.storage.local.clear()
    }

    async storageIsEmpty() {
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
}