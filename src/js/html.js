import { collectStyles, loopNodesCollectStyles, addWrapper, addHeader } from './functions'
import Print from './print'

export default {
  print: (params, printFrame) => {
    // Get HTML printable element
    let printElement = typeof params.printable === 'string'
      ? document.getElementById(params.printable)
      : typeof params.printable === 'object'
        ? params.printable
        : null

    // Check if element exists
    if (!printElement) {
      window.console.error('Invalid HTML element id: ' + params.printable)

      return false
    }

    let printableElement = document.createElement('div')
    // Make a copy of the printElement to prevent DOM changes
    printableElement.appendChild(printElement.cloneNode(true))

    // Add cloned element to DOM, to have DOM element methods available. It will also be easier to colect styles
    printableElement.setAttribute('style', 'display:none;')
    printableElement.setAttribute('id', 'printJS-html')
    document.body.appendChild(printableElement)

    // Update printableElement variable with newly created DOM element
    printableElement = document.getElementById('printJS-html')

    // Get main element styling
    printableElement.setAttribute('style', collectStyles(printableElement, params) + 'margin:0 !important;')

    // Get all children elements
    let elements = printableElement.children

    // Get styles for all children elements
    loopNodesCollectStyles(elements, params)

    // Add header if any
    if (params.header) {
      addHeader(printableElement, params.header, params.headerStyle)
    }

    // Remove DOM printableElement
    document.body.removeChild(printableElement)

    // Store html data
    params.htmlData = addWrapper(printableElement.innerHTML, params)

    // Print html element contents
    Print.send(params, printFrame)
  }
}
