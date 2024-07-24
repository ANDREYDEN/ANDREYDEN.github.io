export function addCommonStyles(parentElement) {
    addStylesheet(parentElement, 'css/main.css')
    addStylesheet(parentElement, 'css/buttons.css')
    addStylesheet(parentElement, 'css/inputs.css')
}

export function addStylesheet(parentElement, filePath) {
    const styleLink = document.createElement('link')
    styleLink.setAttribute('rel', 'stylesheet')
    styleLink.setAttribute('href', filePath)
    parentElement.appendChild(styleLink)
}