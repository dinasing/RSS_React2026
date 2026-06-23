export const parsePageParam = (value: string | null): number => {
  if (!value) {
    return 1;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
};

export const buildPageSearchParams = (
  current: URLSearchParams,
  page: number
): URLSearchParams => {
  const next = new URLSearchParams(current);

  if (page <= 1) {
    next.delete('page');
  } else {
    next.set('page', String(page));
  }

  return next;
};
