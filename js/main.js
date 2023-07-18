let articles

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
 * 
 */
function makeSelected(currentArticleId) {
    const article = articles.find(article => article.id === currentArticleId)
    const list = document.getElementById('content-list')
    const className = 'selected-nav'

    for (let el of list.childNodes) {
        const elementText = el.childNodes[0].wholeText
        el.classList.remove(className)
        if (elementText === article.title) {
            el.classList.add(className)
        }
    }
}

/**
 * FUNCTION - renders the navigation buttons' content depending on the current article
 */
function renderNavigation(articleId) {
    const articleIndex = articles.findIndex(article => article.id === articleId)

    let buttonPrev = document.getElementById('previous')
    let buttonNext = document.getElementById('next')

    const LEN = articles.length
    let previousArticle = articles[(LEN + ((articleIndex - 1) % LEN)) % LEN]
    let nextArticle = articles[(articleIndex + 1) % LEN]

    buttonPrev.setAttribute('value', previousArticle.id)
    buttonNext.setAttribute('value', nextArticle.id)
    buttonPrev.getElementsByTagName('label')[0].innerHTML = previousArticle.title
    buttonNext.getElementsByTagName('label')[0].innerHTML = nextArticle.title
}

/**
 * Renders the contents of an appropriate html article
 * @param {number} articleId the id of the article to be rendered
 */
async function renderArticle(articleId) {
    renderNavigation(articleId)

    const contentElement = document.getElementById('content')

    const post = document.createElement('project-post')
    post.setAttribute('post-id', articleId)
    contentElement.innerHTML = ''
    contentElement.appendChild(post)

    location.href = `#${articleId}`
    window.scrollTo(0, 0)

    // change the state of the content list
    makeSelected(articleId)
}

/**
 * FUNCTION - renders an article depending on the type of the nav button clicked
 * ARGS
 *      id (str) - the id of the button that is being clicked
 * RETURNS
 *      function - the instructions to be executed
 */
function onNavButtonClick(id) {
    return () => {
        let button = document.getElementById(id)
        let articleId = button.getAttribute('value')
        renderArticle(articleId)
    }
}

/**
 * FUNCTION - renders an article depending on the clicked list option
 */
function onListOptionClick() {
    const articleId = this.getAttribute('article-id')
    renderArticle(articleId)
}

window.onload = async () => {
    const response = await fetch('js/articles.json')
    const allArticles = await response.json()
    articles = allArticles.filter(a => !a.hidden)

    // render first article
    renderArticle(articles[0].id)

    // render content list items
    const contentList = document.getElementById('content-list')
    articles.forEach((article, idx) => {
        let li = document.createElement('li')
        li.appendChild(document.createTextNode(article.title))
        li.setAttribute('article-id', article.id)
        if (idx == 0) {
            li.classList.add('selected-nav')
        }
        contentList.appendChild(li)
    })

    // render footer
    insertText({ id: 'copy', text: `&copy Andrii Denysenko, ${new Date().getFullYear()}` })

    // attach event listeners

    window.addEventListener('hashchange', () => {
        const route = location.href.split('#')[1]

        const article = articles.find(article => article.id === route)
        if (!article) return

        renderArticle(article.id)
    })

    document
        .getElementById('previous')
        .addEventListener('click', onNavButtonClick('previous'))

    document
        .getElementById('next')
        .addEventListener('click', onNavButtonClick('next'))

    document
        .getElementById('next-article')
        .addEventListener('click', onNavButtonClick('next'))

    document
        .getElementById('content-list')
        .childNodes
        .forEach(child => {
            if (child.nodeName === 'LI') {
                child.addEventListener('click', onListOptionClick.bind(child))
            }
        })
}
