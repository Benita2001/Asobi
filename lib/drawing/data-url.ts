export function estimateDataUrlSizeBytes(dataUrl: string): number {
  const commaIndex = dataUrl.indexOf(",");

  if (commaIndex === -1) {
    return 0;
  }

  const base64 = dataUrl.slice(commaIndex + 1);
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;

  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}
