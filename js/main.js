var ARTICLES = {
    'Launchio': {
        'date': 'October 2018',
        'content': [
            ['img', 'img/Launchio/thumb.jpg'],
            ['p', 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed \
                consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris \
                condimentum nibh, ut fermentum massa justo sit amet risus.'],
            ['img', 'img/Launchio/thumb.jpg'],
            ['p', 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed \
                consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris \
                condimentum nibh, ut fermentum massa justo sit amet risus.'],
            ['p', 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed \
                consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus, tellus ac cursus commodo, tortor mauris \
                    condimentum nibh, ut fermentum massa justo sit amet risus.'],
        ]
    }
}

const replaceTextContent = ({id, text}) => {
    let element = document.getElementById(id)
    element.innerHTML = text
    return element
}

const renderArticle = (title) => {
    replaceTextContent({id: 'post-title', text: title})
    replaceTextContent({
        id: "post-date",
        text: `&#128343  <i>${ARTICLES[title].date}</i>`
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
    ARTICLES[title].content.forEach((element) => {
        let key = element[0]
        let val = element[1]
        postContent.appendChild(cases[key](val))
    })
}

window.onload = () => {
    renderArticle('Launchio')

    // render footer
    replaceTextContent({id: 'copy', text: `&copy Andrii Denysenko, ${new Date().getFullYear()}`})
}