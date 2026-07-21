import { describe, expect, it } from "vitest";

import {
  EMPTY_JOURNEY_STATE,
  isAgeGroup,
  parseJourneyState,
} from "../lib/journey-state";

describe("journey state", () => {
  it.each(["4-6", "7-9", "10-12"])(
    "accepts the supported age group %s",
    (ageGroup) => {
      expect(isAgeGroup(ageGroup)).toBe(true);
    },
  );

  it("rejects unsupported age groups", () => {
    expect(isAgeGroup("3-5")).toBe(false);
    expect(isAgeGroup(7)).toBe(false);
  });

  it("parses a valid stored journey", () => {
    expect(parseJourneyState('{"ageGroup":"7-9"}')).toEqual({
      ageGroup: "7-9",
    });
  });

  it.each([null, "", "not-json", '{"ageGroup":"all"}', "{}"])(
    "falls back safely for invalid stored value %s",
    (value) => {
      expect(parseJourneyState(value)).toEqual(EMPTY_JOURNEY_STATE);
    },
  );
});
