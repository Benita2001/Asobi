export const MAX_NARRATION_LENGTH = 1200;

type NarrationLesson = {
  title: string;
  introduction: string;
  activity: {
    type: string;
    prompt: string;
    choices: Array<{ id: string; label: string }>;
  };
};

export function buildLessonNarration(lesson: NarrationLesson): string {
  const choices =
    lesson.activity.type === "multiple_choice"
      ? ` Your choices are: ${lesson.activity.choices
          .map((choice) => `${choice.id}, ${choice.label}`)
          .join("; ")}.`
      : "";
  const text =
    `${lesson.title}. ${lesson.introduction} Here is your activity: ${lesson.activity.prompt}.${choices}`
      .replace(/\s+/g, " ")
      .trim();
  if (!text || text.length > MAX_NARRATION_LENGTH)
    throw new Error("NARRATION_TEXT_INVALID");
  return text;
}
