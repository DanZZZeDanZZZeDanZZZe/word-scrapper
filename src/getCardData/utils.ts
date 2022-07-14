export function getUnderscores(word: string): string {
  return new Array(word.length).fill("_").join("")
}

export function replaceWordToUnderscores(word: string, str: string): string {
  return str.replaceAll(word, getUnderscores(word))
}

export function extractNumber(str: string): number | null {
  const candidate = Array.from(str.matchAll(/\d/g))
    .map((i) => i[0])
    .join("")

  if (!candidate) {
    return null
  }

  if (candidate[0] === "") {
    return null
  }

  return Number(candidate)
}

export function getRankTag(rankNumber: number): string {
  const tagStart = "eng-word"

  if (rankNumber <= 500) {
    return `${tagStart}_first-500`
  } else if (rankNumber <= 1000) {
    return `${tagStart}_first-1000`
  } else if (rankNumber <= 3000) {
    return `${tagStart}_first-3000`
  } else if (rankNumber <= 5000) {
    return `${tagStart}_first-5000`
  } else if (rankNumber <= 10000) {
    return `${tagStart}_first-10000`
  }

  return `${tagStart}_over-10000`
}
