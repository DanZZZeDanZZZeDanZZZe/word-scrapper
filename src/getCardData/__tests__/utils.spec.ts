import {
  getUnderscores,
  replaceWordToUnderscores,
  extractNumber,
  getRankTag,
} from "../utils"
import { data1 } from "../../../__test-data__/replaceWordToUnderscores"

describe("test getUnderscores function", () => {
  test("should return the correct number of underscores", () => {
    expect(getUnderscores("")).toBe("")
    expect(getUnderscores("car")).toBe("___")
    expect(getUnderscores("dog")).toBe("___")
    expect(getUnderscores("additional")).toBe("__________")
  })
})

describe("test replaceWordToUnderscores function", () => {
  test("should replace word", () => {
    const { startExamples, endExamples, word } = data1

    expect(replaceWordToUnderscores(word, startExamples)).toBe(endExamples)
  })
})

describe("test extractNumbers function", () => {
  test("should return number", () => {
    expect(extractNumber("35")).toBe(35)
    expect(extractNumber("   35   ")).toBe(35)
    expect(extractNumber("sdsad35sd")).toBe(35)
    expect(extractNumber(" 12")).toBe(12)
    expect(extractNumber(" 5 136")).toBe(5136)
    expect(extractNumber(" 5 136 232")).toBe(5136232)
  })

  test("should return null", () => {
    expect(extractNumber("   ")).toBe(null)
    expect(extractNumber("sdsadsd")).toBe(null)
    expect(extractNumber("")).toBe(null)
  })
})

describe("test getRankTag function", () => {
  test("should return right tag", () => {
    expect(getRankTag(35)).toBe("eng-word_first-500")
    expect(getRankTag(100)).toBe("eng-word_first-500")
    expect(getRankTag(500)).toBe("eng-word_first-500")
    expect(getRankTag(501)).toBe("eng-word_first-1000")
    expect(getRankTag(700)).toBe("eng-word_first-1000")
    expect(getRankTag(1000)).toBe("eng-word_first-1000")
    expect(getRankTag(1001)).toBe("eng-word_first-3000")
    expect(getRankTag(1050)).toBe("eng-word_first-3000")
    expect(getRankTag(3000)).toBe("eng-word_first-3000")
    expect(getRankTag(3001)).toBe("eng-word_first-5000")
    expect(getRankTag(4000)).toBe("eng-word_first-5000")
    expect(getRankTag(5000)).toBe("eng-word_first-5000")
    expect(getRankTag(5010)).toBe("eng-word_first-10000")
    expect(getRankTag(10000)).toBe("eng-word_first-10000")
    expect(getRankTag(10001)).toBe("eng-word_over-10000")
  })
})
