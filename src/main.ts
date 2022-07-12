import { Network } from "./Network/index.js"
import { JSDOM } from "jsdom"
import { extractDOMData } from "./extractDOMData/index.js"
import { getCardData } from "./getCardData/index.js"

export async function main(baseUrl: string, ankiUrl: string) {
  const myArgs = process.argv.slice(2)

  if (myArgs.length === 0) {
    console.error("Enter the search phrase as an argument!")
    return null
  }

  if (myArgs.length > 1) {
    console.error("To many arguments!")
    return null
  }

  if (myArgs[0]) {
    const word = myArgs[0]
    const network = new Network(baseUrl, ankiUrl)

    const pageData = await network.getPage(word)

    if (pageData) {
      const dom = new JSDOM(pageData)
      const data = extractDOMData(dom)
      const cardData = getCardData(data, baseUrl)
      network.createAnkiCard({
        action: "guiAddCards",
        version: 6,
        params: {
          note: cardData,
        },
      })
    }
  }

  return null
}
