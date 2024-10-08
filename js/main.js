import { toggleClass } from "utils"

/** @type {any[]} */
export let articles
let selectedArticleId
/** @type {HTMLElement} */
let contentList
/** @type {HTMLElement} */
let upButton

/**
 * FUNCTION - replaces all of the element's content with the provided text 
 * ARGS
 *     id (str) - the id of the element to change
 *     text (str) - the text to insert
 * RETURNS
 *      object - the resulting element 
 */
function insertText({ id, text }) {
    let element = document.getElementById(id)
    element.innerHTML = text
    return element
}

/**
 * Renders the navigation buttons' content depending on the current article
 */
function renderNavigation() {
    const articleIndex = articles.findIndex(article => article.id === selectedArticleId)

    let buttonPrev = document.getElementById('previous')
    let buttonNext = document.getElementById('next')
    let bottomButtonNext = document.getElementById('next-article')

    if (articleIndex === 0) {
        buttonPrev.classList.add('hidden')
        buttonNext.classList.add('hidden')
        bottomButtonNext.classList.add('hidden')
        return
    }

    buttonPrev.classList.remove('hidden')
    buttonNext.classList.remove('hidden')
    bottomButtonNext.classList.remove('hidden')

    const LEN = articles.length
    const previousArticle = articles[(LEN + ((articleIndex - 1) % LEN)) % LEN]
    const nextArticle = articles[(articleIndex + 1) % LEN]

    buttonPrev.setAttribute('href', `#${previousArticle.id}`)
    buttonNext.setAttribute('href', `#${nextArticle.id}`)
    bottomButtonNext.setAttribute('href', `#${nextArticle.id}`)
    buttonPrev.getElementsByTagName('span')[0].innerHTML = previousArticle.title
    buttonNext.getElementsByTagName('span')[0].innerHTML = nextArticle.title
}

/**
 * Renders the contents of an appropriate html article
 * @param {number} articleId the id of the article to be rendered
 */
async function renderArticle(articleId) {
    renderContentList()
    renderNavigation()

    const contentElement = document.getElementById('content')

    const post = document.createElement('project-post')
    post.setAttribute('post-id', articleId)
    contentElement.innerHTML = ''
    contentElement.appendChild(post)

    window.scrollTo(0, 0)
}

function renderContentList() {
    const contentList = document.getElementById('content-list')
    contentList.innerHTML = ''
    articles.forEach(article => {
        const li = document.createElement('li')
        const a = document.createElement('a')
        a.innerText = article.title

        a.setAttribute('href', `#${article.id}`)
        a.addEventListener('click', () => {
            const isPopover = contentList.hasAttribute('popover')
            if (isPopover) {
                contentList.togglePopover()
            }
        })
        if (article.id === selectedArticleId) {
            li.classList.add('selected-nav')
        }
        li.appendChild(a)
        contentList.appendChild(li)
    })
}

function handleRouteChange() {
    const route = location.href.split('#')[1]

    const article = articles.find(article => article.id === route)
    const firstArticleId = articles[0].id
    if (!article) {
        location.href = `#${firstArticleId}`
    }
    selectedArticleId = article?.id ?? firstArticleId

    renderArticle(selectedArticleId)
}

function handleWindowResize() {
    const isMediumWidth = window.innerWidth <= 900
    if (isMediumWidth ^ contentList.hasAttribute('popover')) {
        contentList.toggleAttribute('popover')
    }
}

function handleScroll() {
    const scrolledDown = window.scrollY > 500
    if (scrolledDown ^ upButton.classList.contains('visible')) {
        toggleClass('up-button', 'visible')
    }
}

function toggleAnimation() {
    const isHidden = toggleClass('background', 'hidden')
    localStorage.setItem('bg-animation-hidden', isHidden)
}

function loadFromLocalStorage() {
    const isBackgroundHidden = localStorage.getItem('bg-animation-hidden') === 'true'

    /** @type {HTMLInputElement} */
    const backgroundSetting = document.getElementById('animation-toggle')
    backgroundSetting.checked = !isBackgroundHidden

    const background = document.getElementById('background')
    if (isBackgroundHidden) {
        background.classList.add('hidden')
    }
}

window.onload = async () => {
    const response = await fetch('js/articles.json')
    const allArticles = await response.json()
    articles = allArticles.filter(a => !a.hidden)

    loadFromLocalStorage()
    handleRouteChange()

    contentList = document.getElementById('content-list')

    // render footer
    insertText({ id: 'copy', text: `&copy Andrii Denysenko, ${new Date().getFullYear()}` })

    // attach event listeners
    window.addEventListener('hashchange', handleRouteChange)

    window.addEventListener('resize', handleWindowResize)
    handleWindowResize()

    window.addEventListener('scroll', handleScroll)

    document.getElementById('animation-toggle').addEventListener('click', toggleAnimation)

    /** @type {HTMLDialogElement} */
    const settingsDialog = document.getElementById('settings')

    document.getElementById('settings-button').addEventListener('click', () => {
        settingsDialog.showModal()
    })

    document.getElementById('dialog-close').addEventListener('click', () => {
        settingsDialog.close()
    })

    document.querySelector('dialog').addEventListener('click', (e) => {
        const backdropClicked = e.target === e.currentTarget
        if (backdropClicked) {
            settingsDialog.close()
        }
    })

    upButton = document.getElementById('up-button')
    upButton.addEventListener('click', () => {
        window.scrollTo({ top: 0 })
    })
}
