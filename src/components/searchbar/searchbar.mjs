import { PlainComponent, PlainState } from "../../../node_modules/plain-reactive/src/index.js"

class Searchbar extends PlainComponent {
    constructor() {
        super('searchbar-component', '../src/components/searchbar/searchbar.css')
    }

    template() {
        return `
            <span class="icon material-symbols-outlined">search</span>
            <input type="text" class="sb-input" placeholder="Search...">
        `
    }
}

export default window.customElements.define('searchbar-component', Searchbar)