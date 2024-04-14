import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { universalFetch } from "./universalFetch";

describe("universalFetch", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", undefined);
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("process", { versions: { node: undefined } });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("should use window.fetch in browser environment", async () => {
    const mockFetch = vi.fn();
    vi.stubGlobal("window", { fetch: mockFetch });

    await universalFetch("https://example.com");

    expect(mockFetch).toHaveBeenCalled();
  });

  it("should use node-fetch in Node.js for versions < 18", async () => {
    vi.stubGlobal("process", { versions: { node: "16.0.0" } });

    const mockFetch = vi.fn();
    vi.doMock("node-fetch", async () => ({ default: mockFetch }));

    await universalFetch("https://example.com");

    expect(mockFetch).toHaveBeenCalled();
  });

  it("should use globalThis.fetch in Node.js for versions >= 18", async () => {
    vi.stubGlobal("process", { versions: { node: "18.0.0" } });

    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    await universalFetch("https://example.com");

    expect(mockFetch).toHaveBeenCalled();
  });

  it("throws an error if no environment is found", async () => {
    await expect(universalFetch("https://example.com")).rejects.toThrow(
      "No fetch implementation found",
    );
  });
});
