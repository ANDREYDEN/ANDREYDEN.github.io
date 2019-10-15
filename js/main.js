var ARTICLES = {}
const SEQUENCE = ['Launchio', 'Logeomio', 'TSP C++ Library']

const replaceTextContent = ({id, text}) => {
    let element = document.getElementById(id)
    element.innerHTML = text
    return element
}

const renderNavigation = ({prev, next}) => {
    let buttonPrev = document.getElementById('previous')
    let buttonNext = document.getElementById('next')

    buttonPrev.innerHTML = `&#128072 ${prev}`
    buttonNext.innerHTML = `${next} &#128073`
}

const renderArticle = ({title, articles}) => {
    let currentIndex = SEQUENCE.indexOf(title)
    const LEN = SEQUENCE.length
    let previousArticle = SEQUENCE[(LEN + (currentIndex - 1) % LEN) % LEN]
    let nextArticle = SEQUENCE[(currentIndex + 1) % LEN]
    renderNavigation({prev: previousArticle, next: nextArticle})

    replaceTextContent({
        id: 'post-title', 
        text: title
    })
    replaceTextContent({
        id: 'post-date',
        text: `&#128343  <i>${articles[title].date}</i>`
    })
    let postContent = document.getElementById('post-content')
    postContent.content = ''
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
    articles[title].content.forEach((element) => {
        let key = element[0]
        let val = element[1]
        postContent.appendChild(cases[key](val))
    })
}

window.onload = async() => {
    // load articles
    ARTICLES = await fetch('https://andreyden.github.io/data/articles.json')
    ARTICLES = await ARTICLES.json()

    // render the first article
    renderArticle({title: SEQUENCE[0], articles: ARTICLES})

    // render footer
    replaceTextContent({id: 'copy', text: `&copy Andrii Denysenko, ${new Date().getFullYear()}`})
}