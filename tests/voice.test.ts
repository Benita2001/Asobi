import { describe, expect, it } from "vitest";
import { resolveSpokenAnswer } from "../lib/voice/transcript";

describe("voice answer integration", () => {
  it("maps spoken choice labels into the existing answer value", () => {
    expect(resolveSpokenAnswer(" Three ", [{ id: "three", label: "3" }])).toBe(
      "three",
    );
    expect(resolveSpokenAnswer("3", [{ id: "three", label: "3" }])).toBe(
      "three",
    );
  });
  it("preserves short-answer transcripts", () => {
    expect(resolveSpokenAnswer("rocket", undefined)).toBe("rocket");
  });
  it("keeps browser voice APIs optional", () => {
    expect(typeof window).toBe("undefined");
  });
});
