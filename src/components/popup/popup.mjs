import { PlainComponent, PlainState } from "../../../node_modules/plain-reactive/src/index.js"
import { Message } from "../../Message.mjs"
import { Context } from "../../Context.mjs"
import { StorageAPI } from "../../api/storage.api.js"

class Popup extends PlainComponent {
    constructor() {
        super('popup-component', '../src/components/popup/popup.css')

        this.isLoading = new PlainState(true, this)
        this.error = new PlainState(null, this)
        this.scripts = new PlainState([], this)
        this.filter = new PlainState('', this)
        
        this.storage = new StorageAPI()
    }

    template() {
        return `
            <!-- HEADER -->
            <header class="popup-header">
                <span class="popup-header-title">Welcome to <b>Agora Trainer</b> !</span>
                <span class="settings-icon material-symbols-outlined">settings</span>
            </header>

            <!-- SCRIPT DROP AREA -->
            <section class="script-drop-area">
                <span class="add-script-icon material-symbols-outlined">post_add</span>
                <span class="script-drop-area-label">Drop a new script</span>
                <span class="script-drop-area-info">( only JSON files are accepted )</span>
            </section>

            <input type="file" class="script-input" accept=".json" hidden multiple>

            <!-- SCRIPT LIST -->
            <section class="scripts ${this.scripts.getState().length === 0 ? 'empty' : ''}">
               <script-list-component></script-list-component>
            </section>  

            <!-- SEARCH BAR -->
            <searchbar-component></searchbar-component>
        `
    }

    listeners() {
        document.addEventListener('DOMContentLoaded', async () => await this.loadScripts())
        this.$('.script-drop-area').onclick = () => this.$('.script-input').click()
        this.$('.script-input').onchange = () => this.uploadScript()
    }

    async loadScripts() {
        return new Promise(resolve => {
            chrome.storage.local.get(['scripts'], (res) => {
                res.scripts.forEach(script => {
                    this.addScript(script)
                })
                resolve()
            })
        })
    }

    async uploadScript() {
        const fileInput =  this.$('.script-input')
        Array.from(fileInput.files).forEach(file => {
            const reader = new FileReader()
            reader.onload = async (e) => {
                const content = e.target.result
                const data = JSON.parse(content)

                // Script saving to storage through the service worker
                this.storage.handleLoadedScript(data)

                // We add a new script component to the DOM
                this.addScript(data)
            }

            reader.readAsText(file)
        })
    }

    async deleteScript(name) {
        console.log("Deleting script from storage with name: " + name)
        try {
            this.storage.handleDeleteScript(name)
        }

        catch (error) {
            console.error(error)
        }
    }

    addScript(data) {
        const scriptComponent = document.createElement('script-component')
        scriptComponent.id = `script-component-${this.scripts.getState().length + 1}`
        scriptComponent.dataset.script = JSON.stringify(data)

        const scripts = this.scripts.getState()
        scripts.push(scriptComponent)
        this.scripts.setState(scripts)
        this.$('script-list-component').scripts.setState(scripts)
    }

    setFilter(filter) {
        this.$('script-list-component').filter.setState(filter)
    }

    clearFilter() {
        this.$('script-list-component').filter.setState('')
    }

    filteredScripts() {
        if (this.filter.getState().length === 0) return this.scripts.getState()

        return []
    }
}

export default window.customElements.define("popup-component", Popup)