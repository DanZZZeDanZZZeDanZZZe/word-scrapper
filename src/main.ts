import { Network } from "./Network/index.js"
import { JSDOM } from "jsdom"
import { extractDOMData } from "./extractDOMData/index.js"
import { getCardData } from "./getCardData/index.js"
import { Command } from "commander"

async function guiAddCard(
  word: string,
  maxExamplesNum: number,
  baseUrl: string,
  ankiUrl: string
) {
  const network = new Network(baseUrl, ankiUrl)

  const pageData = await network.getPage(word)

  if (pageData) {
    const dom = new JSDOM(pageData)
    const data = extractDOMData(dom)
    const cardData = getCardData(data, maxExamplesNum, baseUrl)
    console.log(cardData)
    network.createAnkiCard({
      action: "guiAddCards",
      version: 6,
      params: {
        note: cardData,
      },
    })
  }
}

export function main(baseUrl: string, ankiUrl: string) {
  const program = new Command()

  program
    .command("scrape <word>")
    .option("-e, --examples <number>", "maximum number of examples", "80")
    .action((word, options) => {
      const maxExamples = Number(options.examples)

      if (isNaN(maxExamples)) {
        throw new Error("The -e option must be a number!")
      }

      guiAddCard(word, maxExamples, baseUrl, ankiUrl)
    })

  program.parse()
}
