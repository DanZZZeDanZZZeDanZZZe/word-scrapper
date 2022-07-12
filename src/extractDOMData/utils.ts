export function getElementBySelector(
  document: Document | Element,
  selector: string
) {
  const candidate = document.querySelector(selector)

  if (candidate !== null) {
    return candidate
  }
  throw new Error(`Element by "${selector}" selector  not found in document!`)
}

export function getElementsBySelector(
  document: Document | Element,
  selector: string
) {
  const candidates = document.querySelectorAll(selector)

  if (candidates !== null) {
    return candidates
  }
  throw new Error(`Elements by "${selector}" selector  not found in document!`)
}
