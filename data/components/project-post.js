import { addCommonStyles, addStylesheet } from 'utils'

class ProjectPost extends HTMLElement {
    constructor() {
        super()

        const shadowRoot = this.attachShadow({ mode: 'open' })

        addCommonStyles(shadowRoot)
        addStylesheet(shadowRoot, 'data/components/project-post.css')

        const template = document.getElementById('project-post')
        shadowRoot.appendChild(template.content.cloneNode(true))
    }

    static get observedAttributes() {
        return ['post-id'];
    }

    attributeChangedCallback(name, _, newValue) {
        if (name !== 'post-id') return

        this.renderPost(newValue)
    }

    async renderPost(postId) {
        const article = articles.find(article => article.id === postId)
        const response = await fetch(`data/articles/${article.title}.html`)

        if (postId === 'profile') {
            const lastChild = this.shadowRoot.children[this.shadowRoot.children.length - 1]
            lastChild.innerHTML = await response.text()
            return
        }

        const postContent = this.shadowRoot.getElementById('post-content')
        postContent.innerHTML += await response.text()

        const postTitle = this.shadowRoot.getElementById('post-title')
        postTitle.innerText = article.title

        const postDescription = this.shadowRoot.getElementById('post-description')
        postDescription.innerText = article.description

        const postDate = this.shadowRoot.getElementById('post-date')
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const [year, monthNum] = article.start_date.split('-')
        postDate.innerText = `${months[+monthNum - 1]} ${year}`

        const githubLink = this.shadowRoot.getElementById('github-link')
        githubLink.setAttribute('href', `https://github.com/${article.repo}`)

        const demoLink = this.shadowRoot.getElementById('demo-link')
        demoLink.className = ''
        if (article.demo) {
            demoLink.setAttribute('href', article.demo)
        } else {
            demoLink.className = 'disabled'
        }

        const postThumbnail = this.shadowRoot.getElementById('post-thumbnail')
        postThumbnail.setAttribute('src', `img/${article.title}/thumb.png`)

        const postLanguages = this.shadowRoot.getElementById('post-languages')
        postLanguages.innerHTML = ''
        for (const language of article.languages) {
            const languageListItem = document.createElement('li')
            postLanguages.appendChild(languageListItem)
            const languageElement = document.createElement('code')
            languageElement.textContent = language
            languageListItem.appendChild(languageElement)
        }

        const postTech = this.shadowRoot.getElementById('post-tech')
        postTech.innerHTML = ''
        for (const tech of article.tech) {
            const techListItem = document.createElement('li')
            postTech.appendChild(techListItem)
            const techElement = document.createElement('code')
            techElement.textContent = tech
            techListItem.appendChild(techElement)
        }
    }
}

customElements.define('project-post', ProjectPost)