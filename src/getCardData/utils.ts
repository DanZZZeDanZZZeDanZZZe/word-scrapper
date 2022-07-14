export function getUnderscores(word: string): string {
  return new Array(word.length).fill("_").join("")
}

export function replaceWordToUnderscores(word: string, str: string): string {
  return str.replaceAll(word, getUnderscores(word))
}
