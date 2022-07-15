import { CardData, ExtractedWordData } from "../types.js"
import { extractNumber, getRankTag, replaceWordToUnderscores } from "./utils.js"

function getExamplesForAnswer(examples: ExtractedWordData["examples"]) {
  return examples
    .map((example, index) => example.trim() + (index % 2 ? "<br><br>" : "<br>"))
    .join("")
}

export function getExamplesForQuestion(
  examples: ExtractedWordData["examples"],
  word: ExtractedWordData["word"]
) {
  return replaceWordToUnderscores(
    word,
    examples.filter((_, index) => !(index % 2)).join("<br><br>")
  )
}

function getAudioData(
  audioUrl: ExtractedWordData["audioUrl"],
  baseUrl: string
): CardData["audio"] {
  const url = `${baseUrl}${audioUrl}`
  const matchArr = audioUrl.match(/data.*/)

  if (!matchArr || !matchArr?.[0]) {
    throw new Error("unknown audio format")
  }

  const filename = matchArr[0].replaceAll("/", "-")

  return [
    {
      url,
      filename,
      fields: ["Sound"],
    },
  ]
}

function getRankTagData(wordRank: string): string | null {
  const rankNumber = extractNumber(wordRank)
  if (rankNumber) {
    return getRankTag(rankNumber)
  }

  return null
}

export function getCardData(
  wordData: ExtractedWordData,
  maxExamplesNum: number,
  baseUrl: string
): CardData {
  const structure = wordData.word.trim().toLocaleLowerCase()

  const maxArrLength = maxExamplesNum * 2

  const examples =
    wordData.examples.length > maxArrLength
      ? wordData.examples.slice(0, maxArrLength)
      : wordData.examples

  const examplesForAnswer = getExamplesForAnswer(examples)
  const examplesForQuestion = getExamplesForQuestion(examples, structure)
  const audio = getAudioData(wordData.audioUrl, baseUrl)

  const tags = ["eng-word"]
  const rankTag = getRankTagData(wordData.wordRank)
  if (rankTag) {
    tags.push(rankTag)
  }

  return {
    deckName: "__TEMP__",
    modelName: "[LANG] vocabulary card",
    fields: {
      Structure: structure,
      Transcription: wordData.usTranscription,
      Explanation: wordData.translation,
      "Examples (for answers)": examplesForAnswer,
      "Examples (for question)": examplesForQuestion,
    },
    tags,
    audio,
  }
}
