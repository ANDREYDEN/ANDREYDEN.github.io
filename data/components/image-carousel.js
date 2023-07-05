class ImageCarousel extends HTMLElement {
    constructor() {
        super()

        const template = document.getElementById('image-carousel')

        const shadowRoot = this.attachShadow({ mode: 'open' })
        shadowRoot.appendChild(template.content.cloneNode(true))

        this.slides = this.querySelector('div[slot="slides"]')
        this.indicators = shadowRoot.querySelector('div.indicators')
        for (let i = 0; i < this.slides.children.length; i++) {
            const slide = this.slides.children[i]
            slide.classList.add('hidden')

            const indicator = document.createElement('div')
            indicator.classList.add('indicator')

            if (i === 0) {
                slide.classList.add('visible')
                indicator.classList.add('active')
            }

            this.indicators.appendChild(indicator)
        }

        const nextButton = shadowRoot.querySelector('button.next-slide')
        nextButton.addEventListener('click', this.handleNextSlideButtonClick.bind(this))

        const prevButton = shadowRoot.querySelector('button.prev-slide')
        prevButton.addEventListener('click', this.handlePrevSlideButtonClick.bind(this))
    }

    handleNextSlideButtonClick() {
        const visibleSlide = this.slides.getElementsByClassName('visible')[0]
        const nextSlide = visibleSlide.nextElementSibling ?? this.slides.firstElementChild
        nextSlide.classList.add('visible')
        visibleSlide.classList.remove('visible')

        const activeIndicator = this.indicators.getElementsByClassName('active')[0]
        const nextIndicator = activeIndicator.nextElementSibling ?? this.indicators.firstElementChild
        nextIndicator.classList.add('active')
        activeIndicator.classList.remove('active')
    }

    handlePrevSlideButtonClick() {
        const visibleSlide = this.slides.getElementsByClassName('visible')[0]
        const prevSlide = visibleSlide.previousElementSibling ?? this.slides.lastElementChild
        prevSlide.classList.add('visible')
        visibleSlide.classList.remove('visible')

        const activeIndicator = this.indicators.getElementsByClassName('active')[0]
        const prevIndicator = activeIndicator.previousElementSibling ?? this.indicators.lastElementChild
        prevIndicator.classList.add('active')
        activeIndicator.classList.remove('active')
    }
}

customElements.define('image-carousel', ImageCarousel)