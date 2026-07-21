export const AGE_GROUPS = ["4-6", "7-9", "10-12"] as const;

export type AgeGroup = (typeof AGE_GROUPS)[number];

export interface JourneyState {
  ageGroup: AgeGroup | null;
}
