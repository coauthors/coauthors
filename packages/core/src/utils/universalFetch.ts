export async function setupFetch() {
  if (typeof window !== "undefined" && window.fetch) {
    return window.fetch;
  }

  if (typeof process !== "undefined" && process.versions.node) {
    const [major] = process.versions.node.split(".").map(Number);

    if (major < 18) {
      const mod = await import("node-fetch");
      return mod.default as unknown as typeof fetch;
    }

    return globalThis.fetch;
  }

  return undefined;
}

export async function universalFetch(
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1],
) {
  const fetchFn = await setupFetch();
  if (!fetchFn) throw new Error("No fetch implementation found");

  return fetchFn(input, init);
}
