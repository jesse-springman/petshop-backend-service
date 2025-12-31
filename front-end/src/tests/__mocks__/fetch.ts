type FetchResponseMock<T> = {
  ok: boolean;
  status: number;
  body: T;
};

export function mockFetch<T>({ ok, status, body }: FetchResponseMock<T>) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  } as Response);
}
