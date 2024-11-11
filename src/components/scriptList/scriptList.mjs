import { PlainComponent, PlainState } from "../../../node_modules/plain-reactive/src/index.js"

class ScriptList extends PlainComponent {
    constructor() {
        super('script-list-component', '../src/components/scriptList/scriptList.css')

        this.scripts = new PlainState([], this)
        this.filter = new PlainState('', this)
    }

    template() {
        return `
            ${this.filteredScripts().map(script => {
                return script.outerHTML
            }).join('\n')}
        `
    }

    setFilter(filter) {
        this.filter.setState(filter)
    }

    clearFilter() {
        this.filter.setState('')
    }

    filteredScripts() {
        if (this.filter.getState().length === 0) return this.scripts.getState()
        
        // Implementar la lógica de filtrado
        const scripts = this.scripts.getState()
        const filtered = scripts.filter(script => {
            const data = JSON.parse(script.dataset.script)
            const regex = new RegExp(this.filter.getState(), 'i')
            return data.name.match(regex)
        })

        return filtered
    }

    async deleteScript(id, name) {
        await this.parentComponent.deleteScript(name)

        console.log("Removing element with id: " + id)
        try {
            const updatedScripts = this.scripts.getState().filter(script => script.id !== id)
            this.scripts.setState(updatedScripts)
        }

        catch (error) {
            console.error(error)
        }
    }
}

export default window.customElements.define('script-list-component', ScriptList)