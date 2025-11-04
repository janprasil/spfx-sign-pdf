export const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(v, max));
export const safeRatioMul = (n?: number, ratio?: number) =>
  (n ?? 0) * (ratio ?? 0);
