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

/**
 * Toggles [className] on element with id [elementId]. If [className] is present, it will get removed, otherwise - added.
 * @param {string} elementId The id of the target element
 * @param {string} className The name of the class to toggle
 * @returns {boolean} Whether [className] is now present on the element
 */
export function toggleClass(elementId, className) {
    const element = document.getElementById(elementId)
    const classExists = element.classList.contains(className)
    if (classExists) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }

    return !classExists
}