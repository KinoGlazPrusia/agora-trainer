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

            <input type="file" class="script-input" accept=".txt" hidden>

            <section class="popup-content">
                <script-component></script-component>
            </section>  
        `
    }
}

export default window.customElements.define("popup-component", Popup)