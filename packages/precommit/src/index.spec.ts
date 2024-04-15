import { describe, expect, it } from "vitest";
import { dummy } from ".";

describe("dummy", () => {
  it("should be dummy string", () => {
    expect(dummy).toBe("dummy");
  });
});
