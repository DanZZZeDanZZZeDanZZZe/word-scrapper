import { getUnderscores, replaceWordToUnderscores } from "../utils"
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
