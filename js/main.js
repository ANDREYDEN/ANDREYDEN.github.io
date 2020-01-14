const SEQUENCE = [
    "Profile",
    "Graph Editor",
    "Launchio",
    "TSP C++ Library",
    "Logeomio",
    "Gravitor",
    "Stelo",
    "Emojillite",
]

/**
 * FUNCTION - replaces all of the element's content with the provided text 
 * ARGS
 *     id (str) - the id of the element to change
 *     text (str) - the text to insert
 * RETURNS
 *      object - the resulting element 
 */
const insertText = ({id, text}) => {
    let element = document.getElementById(id)
    element.innerHTML = text
    return element
}

/**
 * FUNCTION - renders the navigation buttons' content depending on the current article
 */
function renderNavigation(currentIndex) {
    let buttonPrev = document.getElementById('previous')
    let buttonNext = document.getElementById('next')

    const LEN = SEQUENCE.length
    let previousArticle = SEQUENCE[(LEN + ((currentIndex - 1) % LEN)) % LEN]
    let nextArticle = SEQUENCE[(currentIndex + 1) % LEN]

    buttonPrev.setAttribute('value', previousArticle)
    buttonNext.setAttribute('value', nextArticle)
    buttonPrev.getElementsByTagName('label')[0].innerHTML = previousArticle
    buttonNext.getElementsByTagName('label')[0].innerHTML = nextArticle 
}

/**
 * FUNCTION - renders the contents of an appropriate html article
 * ARGS
 *      title (str) - the title of the article to be rendered
 */
function renderArticle(title) {
    renderNavigation(SEQUENCE.indexOf(title))
    fetch(`data/articles/${title}.html`).then(response => {
        response.text().then(data => {
            let postRoot = document.getElementById('post')
            postRoot.innerHTML = data
            window.scrollTo(0, 0)
        })
    })
}

/**
 * FUNCTION - removes the glowing animation 
 */
function removeGlowing() {
    document.getElementById('previous').classList.remove('glowing')
    document.getElementById('next').classList.remove('glowing')
}

/**
 * FUNCTION - renders an article depending on the type of the nav button clicked
 * ARGS
 *      id (str) - the id of the button that is being clicked
 * RETURNS
 *      function - the instructions to be executed
 */
function onNavButtonClick(id){
    return () => {
        let button = document.getElementById(id)
        removeGlowing()
        let title = button.getAttribute('value')
        renderArticle(title)
    }
}

/**
 * FUNCTION - renders an article depending on the clicked list option
 */
function onListOptionClick() {
    renderArticle(this.childNodes[0].wholeText)
    removeGlowing()
}

window.onload = () => {
    // render first article
    renderArticle(SEQUENCE[0])

    // render content list items
    const contentList = document.getElementById('content-list')
    SEQUENCE.forEach(name => {
        let li = document.createElement('li')
        li.appendChild(document.createTextNode(name))
        contentList.appendChild(li)
    })

    // render footer
    insertText({id: 'copy', text: `&copy Andrii Denysenko, ${new Date().getFullYear()}`})

    // attach event listeners
    document
        .getElementById('logo')
        .addEventListener('click', () => renderArticle(SEQUENCE[0]))

    document
        .getElementById('previous')
        .addEventListener('click', onNavButtonClick('previous'))

    document
        .getElementById('next')
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