export function resolveSpokenAnswer(
  transcript: string,
  choices: Array<{ id: string; label: string }> | undefined,
): string {
  const normalized = transcript.trim().toLowerCase();
  return (
    choices?.find(
      (choice) =>
        choice.id.toLowerCase() === normalized ||
        choice.label.trim().toLowerCase() === normalized,
    )?.id ?? transcript
  );
}
