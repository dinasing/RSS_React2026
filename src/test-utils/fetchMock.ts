type FetchHandler = (url: string) => Response | Promise<Response>;

export function getFetchCallUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.href;
  }

  return input.url;
}

export function jsonResponse(
  data: unknown,
  { ok = true, status = ok ? 200 : 400 }: { ok?: boolean; status?: number } = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    statusText: ok ? 'OK' : 'Error',
    headers: { 'Content-Type': 'application/json' },
  });
}

export function setupFetchMock(handler: FetchHandler) {
  const fetchMock = vi.fn((input: RequestInfo | URL) =>
    Promise.resolve(handler(getFetchCallUrl(input)))
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

export function mockSearchAndDefaultFetch(handlers: {
  defaultBooks?: unknown;
  search?: (query: string) => unknown;
  bookDetails?: unknown;
}) {
  return setupFetchMock((url) => {
    if (url.includes('works/') && url.endsWith('.json')) {
      return jsonResponse(handlers.bookDetails ?? {});
    }

    if (!url.includes('search.json')) {
      return jsonResponse({}, { ok: false, status: 404 });
    }

    const searchParams = new URL(url).searchParams;
    const query = searchParams.get('q');

    if (query === 'subject:fiction') {
      return jsonResponse(handlers.defaultBooks ?? { numFound: 0, docs: [] });
    }

    if (query && handlers.search) {
      return jsonResponse(handlers.search(query));
    }

    return jsonResponse({ numFound: 0, docs: [] });
  });
}
