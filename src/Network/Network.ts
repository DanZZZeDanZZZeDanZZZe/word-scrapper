import fetch from "node-fetch"
import { ActionData } from "../types.js"

export class Network {
  sourceUrl: string
  ankiUrl: string

  constructor(sourceUrl: string, ankiUrl: string) {
    ;(this.sourceUrl = sourceUrl), (this.ankiUrl = ankiUrl)
  }

  async createAnkiCard(postData: ActionData) {
    try {
      const body = JSON.stringify(postData)
      const response = await fetch(this.ankiUrl, { method: "POST", body })
      const data = await response.json()

      if (response.ok) {
        console.log("New card created", data)
      } else {
        console.error("Bad request", data)
      }
    } catch (error) {
      console.error("Card created error", error)
    }
  }

  async getPage(word: string) {
    try {
      const response = await fetch(`${this.sourceUrl}/word/${word}`)
      const data = await response.text()

      if (response.ok) {
        return String(data)
      }
      console.error("Bad request", data)
    } catch (error) {
      console.error("Request error", error)
    }

    return null
  }
}
