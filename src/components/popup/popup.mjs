import { PlainComponent, PlainState } from "../../../node_modules/plain-reactive/src/index.js"

class Popup extends PlainComponent {
    constructor() {
        super('popup-component', '../src/components/popup/popup.css')

        this.isLoading = new PlainState(true, this)
        this.error = new PlainState(null, this)
        this.scripts = new PlainState([], this)
    }

    template() {
        return `
            <!-- HEADER -->
            <header class="popup-header">
                <span class="popup-header-title">Welcome to Agora Trainer!</span>
                <span class="settings-icon material-symbols-outlined">settings</span>
            </header>

            <!-- SCRIPT DROP AREA -->
            <section class="script-drop-area">
                <span class="add-script-icon material-symbols-outlined">post_add</span>
                <span class="script-drop-area-label">Drop a new script</span>
            </section>

            <input type="file" class="script-input" accept=".json" hidden multiple>

            <section class="scripts">
                ${this.scripts.getState().map(script => {
                    return script.outerHTML
                }).join('\n')}
            </section>  
        `
    }

    listeners() {
        this.$('.script-drop-area').onclick = () => this.$('.script-input').click()
        this.$('.script-input').onchange = () => this.loadScript()
    }

    async loadScript() {
        const fileInput =  this.$('.script-input')
        Array.from(fileInput.files).forEach(file => {
            const reader = new FileReader()
            reader.onload = async (e) => {
                const content = e.target.result
                const data = JSON.parse(content)

                const scriptComponent = document.createElement('script-component')
                scriptComponent.dataset.script = JSON.stringify(data)

                const scripts = this.scripts.getState()
                scripts.push(scriptComponent)
                this.scripts.setState(scripts)
            }

            reader.readAsText(file)
        })
    }
}

export default window.customElements.define("popup-component", Popup)