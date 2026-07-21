import { describe, expect, it } from "vitest";
import {
  EMPTY_LEARNING_MEMORY,
  MEMORY_STORAGE_KEY,
} from "../lib/memory/memory-schema";
import {
  clearLearningMemory,
  extractDrawingInterests,
  recordLesson,
  readLearningMemory,
  updateDrawingInterests,
} from "../lib/memory/learning-memory";

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  } as unknown as Storage;
}
const analysis = {
  schemaVersion: "1.0" as const,
  summary: "A rocket",
  scene: "space",
  visualIdentity: {
    primarySubject: "rocket",
    secondarySubjects: [],
    dominantColors: ["blue"],
    accessories: [],
    distinctiveFeatures: [],
    facialExpression: null,
    pose: "flying",
    artStyle: "child drawing",
    composition: "centered",
    backgroundElements: [],
  },
  objects: [{ name: "rocket", count: 1, confidence: 1, attributes: [] }],
  colors: ["blue"],
  shapes: ["circle"],
  visibleText: [],
  educationalHooks: [
    {
      subject: "math" as const,
      concept: "counting",
      reason: "count stars",
      ageSuitability: ["7-9" as const],
    },
  ],
  childFriendlyObservation: "A rocket is here!",
  uncertaintyNotes: [],
};

describe("learning memory", () => {
  it("creates, loads, and safely resets corrupt storage", () => {
    const store = storage();
    expect(readLearningMemory(store)).toEqual(EMPTY_LEARNING_MEMORY);
    store.setItem(MEMORY_STORAGE_KEY, "not-json");
    expect(readLearningMemory(store)).toEqual(EMPTY_LEARNING_MEMORY);
  });
  it("migrates the previous memory version and can reset it", () => {
    const store = storage();
    store.setItem(
      MEMORY_STORAGE_KEY,
      JSON.stringify({
        version: 0,
        ageGroup: "7-9",
        preferredInteraction: "voice",
      }),
    );
    expect(readLearningMemory(store)).toMatchObject({
      version: 1,
      ageGroup: "7-9",
      preferredInteraction: "voice",
    });
    clearLearningMemory(store);
    expect(readLearningMemory(store)).toEqual(EMPTY_LEARNING_MEMORY);
  });
  it("extracts bounded unique drawing interests", () => {
    expect(extractDrawingInterests(analysis)).toEqual(["rocket"]);
    expect(
      updateDrawingInterests(analysis, EMPTY_LEARNING_MEMORY).drawingInterests,
    ).toEqual(["rocket"]);
  });
  it("updates concepts, history, subjects, and streak", () => {
    const store = storage();
    const first = recordLesson(
      { id: "l1", subject: "math", skills: ["counting"] },
      true,
      1,
      "math",
      readLearningMemory(store),
    );
    expect(first.lessonHistory).toHaveLength(1);
    expect(first.conceptStats[0].correct).toBe(1);
    expect(first.streak).toBe(1);
  });
  it("limits lesson history", () => {
    let memory = EMPTY_LEARNING_MEMORY;
    for (let index = 0; index < 55; index += 1)
      memory = recordLesson(
        { id: `l${index}`, subject: "math", skills: ["counting"] },
        false,
        0,
        "math",
        memory,
      );
    expect(memory.lessonHistory).toHaveLength(50);
  });
});
