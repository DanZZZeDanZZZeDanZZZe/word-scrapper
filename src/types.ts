export type ExtractedWordData = {
  audioUrl: string
  word: string
  wordRank: string
  usTranscription: string
  translation: string
  examples: string[]
}

export type WordData = {
  audio: {
    url: string
    filename: string
  }
  word: string
  transcription: string
  explanation: string
  translate: string
  examplesForAnswer: string
  examplesForQuestion: string
}

type CardDataTextField =
  | "Structure"
  | "Transcription"
  | "Explanation"
  | "Examples (for answers)"
  | "Examples (for question)"

type CardDataAudioField = "Sound"

export type CardDataTextFields = Record<CardDataTextField, string>

export type CardData = {
  deckName: string
  modelName: string
  fields: CardDataTextFields
  tags: string[]
  audio: [
    {
      url: string
      filename: string
      fields: [CardDataAudioField]
    }
  ]
}

export type ActionData = {
  action: "guiAddCards"
  version: 6
  params: {
    note: CardData
  }
}
