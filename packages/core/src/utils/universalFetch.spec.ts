import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('universalFetch', () => {
  beforeEach(() => {
    vi.resetModules()

    vi.stubGlobal('fetch', undefined)
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('process', { versions: { node: undefined } })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should use window.fetch in browser environment', async () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('window', { fetch: mockFetch })

    const mod = await import('./universalFetch')
    await mod.universalFetch('https://example.com')

    expect(mockFetch).toHaveBeenCalled()
  })

  it('should not reinitialize fetchFn if it is already set', async () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('window', { fetch: mockFetch })

    const mod = await import('./universalFetch')
    await mod.universalFetch('https://example.com')

    expect(mockFetch).toHaveBeenCalled()

    const mockFetch2 = vi.fn()
    vi.stubGlobal('window', { fetch: mockFetch2 })

    await mod.universalFetch('https://example.com')
    expect(mockFetch2).not.toHaveBeenCalled()
  })

  it('should use node-fetch in Node.js for versions < 18', async () => {
    vi.stubGlobal('process', { versions: { node: '16.0.0' } })

    const mockFetch = vi.fn()
    vi.doMock('node-fetch', () => ({ default: mockFetch }))

    const mod = await import('./universalFetch')
    // wait for node-fetch to be imported
    await vi.dynamicImportSettled()
    await mod.universalFetch('https://example.com')

    expect(mockFetch).toHaveBeenCalled()
  })

  it('should use globalThis.fetch in Node.js for versions >= 18', async () => {
    vi.stubGlobal('process', { versions: { node: '18.0.0' } })

    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)

    const mod = await import('./universalFetch')
    await mod.universalFetch('https://example.com')

    expect(mockFetch).toHaveBeenCalled()
  })

  it('should not use node-fetch in Node.js for versions >= 18', async () => {
    vi.stubGlobal('process', { versions: { node: '18.0.0' } })

    let nodeFetchCalled = false
    const mockNodeFetch = vi.fn()
    const mockFetch = vi.fn()
    vi.doMock('node-fetch', () => {
      nodeFetchCalled = true
      return { default: mockNodeFetch }
    })

    vi.stubGlobal('fetch', mockFetch)

    const mod = await import('./universalFetch')
    // wait for node-fetch to be imported
    await vi.dynamicImportSettled()
    await mod.universalFetch('https://example.com')

    expect(mockFetch).toHaveBeenCalled()
    expect(mockNodeFetch).not.toHaveBeenCalled()
    expect(nodeFetchCalled).toBe(false)
  })

  it('throws an error if no environment is found', async () => {
    const mod = await import('./universalFetch')
    await expect(mod.universalFetch('https://example.com')).rejects.toThrow('No fetch implementation found')
  })
})
