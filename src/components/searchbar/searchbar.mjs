import { PlainComponent, PlainState } from "../../../node_modules/plain-reactive/src/index.js"

class Searchbar extends PlainComponent {
    constructor() {
        super('searchbar-component', '../src/components/searchbar/searchbar.css')

        this.queryTimer = 300
        this.qeuryDebounce = new PlainState({last: 0, elapsed: 0}, this)
        this.queryCache = new PlainState([], this)
    }

    template() {
        return `
            <span class="icon material-symbols-outlined">search</span>
            <input type="text" class="sb-input" placeholder="Search...">
        `
    }

    listeners() {
        this.$('input').oninput = () => this.search(this.$('input').value)
    }

    search(query) {
        const [time, elapsed] = this.elapsedTime()

        this.qeuryDebounce.setState({last: time, elapsed: elapsed}, false)

        if (this.qeuryDebounce.getState().elapsed > this.queryTimer) {
            this.parentComponent.setFilter(query)
            return 
        }

        // Delayed search after 300ms (in case the user stops typing after typing too quickly)
        setTimeout(() => {
            const [time, elapsed] = this.elapsedTime()
            if (elapsed > this.queryTimer) {
                this.parentComponent.setFilter(query)
            }
        }, this.queryTimer)
    }

    elapsedTime() {
        const time = Date.now()
        const elapsed = time - this.qeuryDebounce.getState().last 

        return [time, elapsed]
    }
}

export default window.customElements.define('searchbar-component', Searchbar)