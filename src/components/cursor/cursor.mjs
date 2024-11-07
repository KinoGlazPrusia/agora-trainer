import { PlainComponent, PlainState } from "../../../node_modules/plain-reactive/src/index.js"

class Cursor extends PlainComponent {
    constructor() {
        super('cursor-component', '../src/components/cursor/cursor.css')
    }

    template() {
        return `
            <style>
            .cursor-component-wrapper {
                position: absolute;
                top: 0;
                left: 0;

                width: 20px;
                height: 20px;
                
                border-radius: 100%;
                background-color: red;

                box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);

                z-index: 9999;

                transition: 500ms;
            }
            </style>
            <div class="center"></div>
        `
    }
}

export default window.customElements.define('cursor-component', Cursor)