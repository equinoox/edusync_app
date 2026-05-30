import type { z } from 'zod';

export function parseSchemaOrThrow<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  input: unknown,
): z.infer<TSchema> {
  const result = schema.safeParse(input);

  if (result.success) {
    return result.data;
  }

  throw new Error(result.error.issues[0]?.message ?? 'Invalid input');
}
