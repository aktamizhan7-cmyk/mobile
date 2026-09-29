/**
 * Display Calculation and Utility Helpers
 * Computes PPI, aspect ratio, resolution classification, and display metrics.
 */

/**
 * Calculates Pixels Per Inch (PPI) based on screen width, height, and diagonal size.
 * Formula: PPI = sqrt(width² + height²) / diagonal_inches
 */
export function calculatePPI(width: number, height: number, diagonalInches: number): number {
  if (!diagonalInches || diagonalInches <= 0 || !width || !height) return 0;
  const diagonalPixels = Math.sqrt(width * width + height * height);
  return Math.round(diagonalPixels / diagonalInches);
}

/**
 * Calculates greatest common divisor for aspect ratio simplification
 */
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * Derives common smartphone aspect ratio representation from width and height
 */
export function calculateAspectRatio(width: number, height: number): string {
  if (!width || !height) return '19.5:9';

  // Ensure height is the longer dimension for vertical smartphone orientation
  const longEdge = Math.max(width, height);
  const shortEdge = Math.min(width, height);

  const ratio = longEdge / shortEdge;

  // Match standard smartphone ratios within 0.05 tolerance
  if (Math.abs(ratio - 16 / 9) < 0.05) return '16:9';
  if (Math.abs(ratio - 18 / 9) < 0.05) return '18:9 (2:1)';
  if (Math.abs(ratio - 19 / 9) < 0.05) return '19:9';
  if (Math.abs(ratio - 19.5 / 9) < 0.05) return '19.5:9';
  if (Math.abs(ratio - 20 / 9) < 0.05) return '20:9';
  if (Math.abs(ratio - 20.5 / 9) < 0.05) return '20.5:9';
  if (Math.abs(ratio - 21 / 9) < 0.05) return '21:9';
  if (Math.abs(ratio - 22 / 9) < 0.05) return '22:9';

  // Fallback to 9-based decimal
  const normalizedNine = ((longEdge / shortEdge) * 9).toFixed(1);
  return `${normalizedNine}:9`;
}

/**
 * Automatically categorizes resolution class
 */
export function getResolutionCategory(
  width: number,
  height: number
): 'HD+' | 'FHD+' | '1.5K' | '2K QHD+' | 'Custom' {
  const shortEdge = Math.min(width, height);
  const longEdge = Math.max(width, height);

  if (shortEdge <= 760) return 'HD+';
  if (shortEdge <= 1120) return 'FHD+';
  if (shortEdge <= 1320 && longEdge <= 2880) return '1.5K';
  if (shortEdge >= 1400 || (shortEdge >= 1340 && longEdge >= 3000)) return '2K QHD+';
  return 'Custom';
}

/**
 * Calculates Screen-to-Body ratio estimate when chassis dimensions are provided
 */
export function estimateScreenToBody(
  screenDiagonalInches: number,
  aspectRatioNumeric: number,
  phoneHeightMm: number,
  phoneWidthMm: number
): number | null {
  if (!screenDiagonalInches || !phoneHeightMm || !phoneWidthMm) return null;

  // 1 inch = 25.4 mm
  const diagMm = screenDiagonalInches * 25.4;
  const angle = Math.atan(1 / aspectRatioNumeric);
  const screenHeightMm = diagMm * Math.cos(angle);
  const screenWidthMm = diagMm * Math.sin(angle);

  const screenArea = screenHeightMm * screenWidthMm;
  const phoneArea = phoneHeightMm * phoneWidthMm;

  if (phoneArea <= 0) return null;
  const percentage = (screenArea / phoneArea) * 100;
  return Math.min(96, Math.max(75, Math.round(percentage * 10) / 10));
}
