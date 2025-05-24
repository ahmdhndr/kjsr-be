/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export function extractFirstZodError(errorFormat: {
  [key: string]: any;
}): string {
  const entries = Object.entries(errorFormat);

  for (const [key, val] of entries) {
    if (
      key !== '_errors' &&
      val &&
      Array.isArray(val._errors) &&
      val._errors.length > 0
    ) {
      return val._errors[0];
    }
  }

  // fallback kalau gak ada error spesifik
  return 'Validation failed';
}
