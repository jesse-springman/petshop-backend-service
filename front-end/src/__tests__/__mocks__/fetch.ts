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

// Test vazio só pra Jest não reclamar que a suite está vazia
test(' Mock Test', () => {
  expect(jest.fn()).toBeDefined();
});
