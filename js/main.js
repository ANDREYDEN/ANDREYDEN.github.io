var ARTICLES = {}
const SEQUENCE = ['Launchio', 'Logeomio', 'TSP C++ Library']

const replaceTextContent = ({id, text}) => {
    let element = document.getElementById(id)
    element.innerHTML = text
    return element
}

const renderNavigation = (currentIndex) => {
    let buttonPrev = document.getElementById('previous')
    let buttonNext = document.getElementById('next')

    const LEN = SEQUENCE.length
    let previousArticle = SEQUENCE[(LEN + ((currentIndex - 1) % LEN)) % LEN]
    let nextArticle = SEQUENCE[(currentIndex + 1) % LEN]

    buttonPrev.innerHTML = `&#128072 ${previousArticle}`
    buttonPrev.setAttribute('value', previousArticle)
    buttonNext.innerHTML = `${nextArticle} &#128073`
    buttonNext.setAttribute('value', nextArticle)
}

const renderArticle = (title) => {
    renderNavigation(SEQUENCE.indexOf(title))

    replaceTextContent({
        id: 'post-title', 
        text: title
    })
    replaceTextContent({
        id: 'post-date',
        text: `&#128343  <i>${ARTICLES[title].date}</i>`
    })
    let postContent = document.getElementById('post-content')
    postContent.innerHTML = ''
    let cases = {
        'p': (val) => {
            let p = document.createElement('p')
            p.appendChild(document.createTextNode(val))
            return p
        },
        'img': (val) => {
            let img = document.createElement('img')
            img.src = val
            return img
        },
    }
    ARTICLES[title].content.forEach((element) => {
        let key = element[0]
        let val = element[1]
        postContent.appendChild(cases[key](val))
    })
}

const onNavButtonClick = (id) => {
    let button = document.getElementById(id)
    let title = button.getAttribute('value')
    renderArticle(title)
}

window.onload = async() => {
    // load articles
    ARTICLES = await fetch('https://andreyden.github.io/data/articles.json')
    ARTICLES = await ARTICLES.json()

    // render the first article
    renderArticle(SEQUENCE[0])

    // render footer
    replaceTextContent({id: 'copy', text: `&copy Andrii Denysenko, ${new Date().getFullYear()}`})

    // attach event listeners
    document
        .getElementById('previous')
        .addEventListener('click', () => onNavButtonClick('previous'))
    document
        .getElementById('next')
        .addEventListener('click', () => onNavButtonClick('next'))
}