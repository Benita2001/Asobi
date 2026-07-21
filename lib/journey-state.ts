import { AGE_GROUPS, type AgeGroup, type JourneyState } from "../types/journey";

export const JOURNEY_STORAGE_KEY = "asobi:journey:v1";

export const EMPTY_JOURNEY_STATE: JourneyState = {
  ageGroup: null,
};

export function isAgeGroup(value: unknown): value is AgeGroup {
  return typeof value === "string" && AGE_GROUPS.includes(value as AgeGroup);
}

export function parseJourneyState(value: string | null): JourneyState {
  if (!value) {
    return EMPTY_JOURNEY_STATE;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "ageGroup" in parsed &&
      (parsed.ageGroup === null || isAgeGroup(parsed.ageGroup))
    ) {
      return { ageGroup: parsed.ageGroup };
    }
  } catch {
    return EMPTY_JOURNEY_STATE;
  }

  return EMPTY_JOURNEY_STATE;
}

export function readJourneyState(): JourneyState {
  if (typeof window === "undefined") {
    return EMPTY_JOURNEY_STATE;
  }

  try {
    return parseJourneyState(
      window.sessionStorage.getItem(JOURNEY_STORAGE_KEY),
    );
  } catch {
    return EMPTY_JOURNEY_STATE;
  }
}

export function writeJourneyState(state: JourneyState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The journey can continue without persistence when storage is unavailable.
  }
}
