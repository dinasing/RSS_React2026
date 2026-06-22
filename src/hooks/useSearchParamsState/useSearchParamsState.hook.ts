'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type SetSearchParamsOptions = {
  replace?: boolean;
};

export const useSearchParamsState = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setSearchParams = useCallback(
    (
      updater:
        | URLSearchParams
        | ((current: URLSearchParams) => URLSearchParams),
      options?: SetSearchParamsOptions
    ) => {
      const current = new URLSearchParams(searchParams?.toString() ?? '');
      const next = typeof updater === 'function' ? updater(current) : updater;
      const query = next.toString();
      const basePath = pathname ?? '/';
      const url = query ? `${basePath}?${query}` : basePath;

      if (options?.replace) {
        router.replace(url);
      } else {
        router.push(url);
      }
    },
    [pathname, router, searchParams]
  );

  return [searchParams, setSearchParams] as const;
};
