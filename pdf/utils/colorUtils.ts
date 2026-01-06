/**
 * Lighten a hex color by mixing it with white.
 * factor = 0 → original
 * factor = 1 → white
 */
export function lightenHexColor(hex: string, factor = 0.6): string {
  const clean = hex.replace("#", "");

  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  const mix = (c: number) =>
    Math.round(c + (255 - c) * factor);

  return (
    "#" +
    [mix(r), mix(g), mix(b)]
      .map(v => v.toString(16).padStart(2, "0"))
      .join("")
  );
}
