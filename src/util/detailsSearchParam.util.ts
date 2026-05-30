const WORK_KEY_PREFIX = '/works/';

export const toDetailsParam = (workKey: string): string =>
  workKey.slice(WORK_KEY_PREFIX.length);

export const fromDetailsParam = (param: string | null): string | null =>
  param ? `${WORK_KEY_PREFIX}${param}` : null;

export const buildDetailsSearchParams = (
  current: URLSearchParams,
  workKey: string | null
): URLSearchParams => {
  const next = new URLSearchParams(current);

  if (!workKey) {
    next.delete('details');
  } else {
    next.set('details', toDetailsParam(workKey));
  }

  return next;
};
