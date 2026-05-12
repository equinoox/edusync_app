'use server';

import type { NewResourceParams } from '@/features/resources/types';
import { createResource } from '@/features/resources/server/resources.service';

export const createResourceAction = async (input: NewResourceParams) => {
  try {
    return await createResource(input);
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.';
  }
};