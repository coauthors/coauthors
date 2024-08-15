import { describe, expect, test } from 'vitest'
import { convert } from './convert'

/* eslint-disable vitest/valid-title, vitest/no-identical-title */
;(process.env.CI === 'true'
  ? // To prevent the error: "Error: Failed to fetch user: rate limit exceeded"
    describe.skip
  : describe)('convert', () => {
  test('', async ({ task }) => {
    expect(await convert(task.name)).toStrictEqual({
      result: task.name,
      isConverted: false,
    })
  })

  test('', async ({ task }) => {
    expect(await convert(task.name)).toStrictEqual({
      result: task.name,
      isConverted: false,
    })
  })

  test(`
    
`, async ({ task }) => {
    expect(await convert(task.name)).toStrictEqual({
      result: task.name,
      isConverted: false,
    })
  })

  test('feat(*): add something', async ({ task }) => {
    expect(await convert(task.name)).toStrictEqual({
      result: task.name,
      isConverted: false,
    })
  })

  test(`feat(*): add something


`, async ({ task }) => {
    expect(await convert(task.name)).toStrictEqual({
      result: task.name,
      isConverted: false,
    })
  })

  test(`feat(*): add something


coauthors: manudeli
`, async ({ task }) => {
    expect(await convert(task.name)).toStrictEqual({
      result: `feat(*): add something


Co-authored-by: Jonghyeon Ko <61593290+manudeli@users.noreply.github.com>
`,
      isConverted: true,
    })
  })

  test(`feat(*): add something


coauthors: manudeli, 2-NOW(Whale)
`, async ({ task }) => {
    expect(await convert(task.name)).toStrictEqual({
      result: `feat(*): add something


Co-authored-by: Jonghyeon Ko <61593290+manudeli@users.noreply.github.com>
Co-authored-by: Whale <71202076+2-NOW@users.noreply.github.com>
`,
      isConverted: true,
    })
  })
})
