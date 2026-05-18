import type { BookDescriptionType } from '../types/bookDetails.type';

export const formatBookDescription = (
  description: BookDescriptionType | undefined
): string | null => {
  if (!description) {
    return null;
  }

  if (typeof description === 'string') {
    return description;
  }

  return description.value ?? null;
};
