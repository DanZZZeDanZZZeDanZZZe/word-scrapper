import { JSDOM } from "jsdom"
import { ExtractedWordData } from "../types.js"
import { getElementBySelector, getElementsBySelector } from "./utils.js"

function extractWordData(document: Document) {
  //TODO: fix it
  const window = document.defaultView
  if (!window) {
    throw new Error(`window isn't exist!`)
  }

  const h1 = getElementBySelector(document, "h1")

  //TODO: fix it
  if (h1 instanceof window.HTMLElement && h1.firstChild && h1.firstChild.nodeValue) {
    return h1.firstChild.nodeValue
  }

  throw new Error(`h1 isn't HTMLElement!`)
}

function extractWordRankData(document: Document) {
  const rank = getElementBySelector(document, "#word_rank_box")

  if (rank) {
    return rank.innerHTML
  }

  throw new Error(`h1 isn't HTMLElement!`)
}

function extractTranslationData(document: Document) {
  const selector = "#content_in_russian > div.t_inline_en"

  const candidate = getElementBySelector(document, selector).textContent

  if (candidate === null) {
    throw new Error(`Element with "${selector}" isn't has text!`)
  }

  return candidate
}

function extractUsTranscriptionData(document: Document) {
  const selector = "#us_tr_sound .transcription"
  const candidate = getElementBySelector(document, selector).textContent
  if (candidate === null) {
    throw new Error(`Element with "${selector}" isn't has text!`)
  }

  return candidate
}

function extractExamplesData(document: Document) {
  const HEADER_TEXT = "Примеры"

  const exampleHeader = Array.from(getElementsBySelector(document, "h3")).find(
    (i) => i.textContent === HEADER_TEXT
  )
  if (!exampleHeader) {
    throw new Error(`h3 with "${HEADER_TEXT}" text not found in document!`)
  }

  const exampelsContainer = exampleHeader.nextElementSibling
  if (!exampelsContainer) {
    throw new Error(`element after "${HEADER_TEXT}" text not found in document!`)
  }

  return Array.from(getElementsBySelector(exampelsContainer, "p"))
    .map((i) => i.textContent)
    .filter((i): i is string => i !== null)
}

function extractAdioUrlData(document: Document) {
  const selector = "#audio_us"
  const candidate = getElementBySelector(document, selector).childNodes[1]

  //TODO: fix it
  const window = document.defaultView
  if (!window) {
    throw new Error(`window isn't exist!`)
  }

  if (candidate instanceof window.HTMLSourceElement) {
    return candidate.src
  }

  throw new Error(`Element in "${selector}" isn't source type element!`)
}

export function extractDOMData(dom: JSDOM): ExtractedWordData {
  const { document } = dom.window

  const word = extractWordData(document)
  const wordRank = extractWordRankData(document)
  const translation = extractTranslationData(document)
  const usTranscription = extractUsTranscriptionData(document)
  const examples = extractExamplesData(document)
  const audioUrl = extractAdioUrlData(document)

  return {
    audioUrl,
    word,
    wordRank,
    usTranscription,
    translation,
    examples,
  }
}
