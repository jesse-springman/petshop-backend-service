import { createCustomer } from '../services/cadastro';
import { mockFetch } from './__mocks__/fetch';

describe('POST /cadastro', () => {
  type responseClient = {
    customer_name: string;
    pet_name: string;
    id: number;
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw error when customer_name is empty', async () => {
    await expect(createCustomer('', 'cacau')).rejects.toThrow(
      "Campo 'Nome do Cliente' deve ser preenchido",
    );
  });

  it('should trow error when pet_name is empty', async () => {
    await expect(createCustomer('jesse', '')).rejects.toThrow(
      "Campo 'Nome do Pet' deve ser preenchido",
    );
  });

  it('client validation field ', async () => {
    mockFetch<responseClient>({
      ok: true,
      status: 201,
      body: {
        customer_name: 'jesse',
        pet_name: 'cacau',
        id: 123,
      },
    });

    const response = await createCustomer('jesse', 'cacau');

    expect(response.customer_name).toBe('jesse');
    expect(response.pet_name).toBe('cacau');
    expect(response.id).toBeDefined();
  });
});
