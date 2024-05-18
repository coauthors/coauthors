import { describe, expect, it } from 'vitest'
import { coauthor } from './coauthor'

describe('coauthor', () => {
  it('should make coauthor string with GitHub username & undefined display names', async () => {
    expect(await coauthor({ user: 'manudeli' })).toBe(
      'Co-authored-by: Jonghyeon Ko <61593290+manudeli@users.noreply.github.com>'
    )
  })
  it('should make coauthor string with GitHub username & defined display name', async () => {
    expect(await coauthor({ user: '2-NOW', name: 'Hyeonjae Lee' })).toBe(
      'Co-authored-by: Hyeonjae Lee <71202076+2-NOW@users.noreply.github.com>'
    )
    expect(await coauthor({ user: '2-NOW', name: 'Whale' })).toBe(
      'Co-authored-by: Whale <71202076+2-NOW@users.noreply.github.com>'
    )
  })
})
