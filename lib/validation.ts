import { z, ZodSchema } from "zod";

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: z.ZodError;
}

/**
 * Validasi data menggunakan Zod schema
 * @param schema - Zod schema untuk validasi
 * @param data - Data yang akan divalidasi
 * @returns Hasil validasi dengan data atau error
 */
export function validateSchema<T>(schema: ZodSchema, data: T): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data as T,
    };
  }

  return {
    success: false,
    error: result.error,
  };
}

/**
 * Validasi data dan throw error jika tidak valid
 * @param schema - Zod schema untuk validasi
 * @param data - Data yang akan divalidasi
 * @returns Data yang sudah divalidasi
 * @throws ZodError jika validasi gagal
 */
export function validateSchemaOrThrow<T>(schema: ZodSchema, data: unknown): T {
  return schema.parse(data) as T;
}

/**
 * Extract error messages dari ZodError
 * @param error - ZodError dari validasi
 * @returns Object dengan field dan pesan error
 */
export function getValidationErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });

  return errors;
}
