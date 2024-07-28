import { addCommonStyles, addStylesheet } from 'utils'

class CollapsibleSection extends HTMLElement {
    constructor() {
        super()

        const shadowRoot = this.attachShadow({ mode: 'open' })

        addCommonStyles(shadowRoot)
        addStylesheet(shadowRoot, 'data/components/collapsible-section.css')

        const template = document.getElementById('collapsible-section')
        shadowRoot.appendChild(template.content.cloneNode(true))

        this._internals = this.attachInternals();

        shadowRoot.getElementById('collapser').addEventListener('click', this.toggleCollapse.bind(this))
        this.content = shadowRoot.getElementById('collapsible-content')
        this.setAttribute('collapsed', '')
    }

    toggleCollapse() {
        if (this.hasAttribute('collapsed')) {
            this.removeAttribute('collapsed')
        } else {
            this.setAttribute('collapsed', '')
        }
    }
}

customElements.define('collapsible-section', CollapsibleSection)