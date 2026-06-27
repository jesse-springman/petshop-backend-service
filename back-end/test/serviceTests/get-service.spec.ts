import { mockPrisma } from '../__mocks__/prisma.mock';
import { GetService } from '../../src/servicesOfBusiness/use-cases/get-service';

describe('GET /services', () => {
  let useCase: GetService;
  const businessId = 'businessID';

  const mockService = [
    {
      id: 'service1',
      name: 'consulta',
      price: '100.00',
      active: true,
      createdAt: new Date('2024-06-10T10:00:00Z'),
    },
    {
      id: 'service-uuid-2',
      name: 'Banho e Tosa',
      price: '90.00',
      active: true,
      createdAt: new Date('2025-01-01'),
    },
    {
      id: 'service-uuid-3',
      name: 'Tosa',
      price: '60.00',
      active: true,
      createdAt: new Date('2025-01-01'),
    },
  ];

  beforeEach(() => {
    useCase = new GetService(mockPrisma as any);
    jest.clearAllMocks();
  });

  it('return all services', async () => {
    mockPrisma.service.findMany.mockResolvedValue(mockService);

    const result = await useCase.execute(businessId);

    expect(mockPrisma.service.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { businessId, active: true },
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          price: true,
          active: true,
          createdAt: true,
        },
      }),
    );
    expect(result.length).toBe(3);
  });

  it('Should return empty when business has services no Active ', async () => {
    mockPrisma.service.findMany.mockResolvedValue([]);

    const result = await useCase.execute(businessId);

    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });

  it('should only return services from the correct business', async () => {
    mockPrisma.service.findMany.mockResolvedValue(mockService);

    const result = await useCase.execute('id-novo');

    expect(mockPrisma.service.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { businessId: 'id-novo', active: true },
      }),
    );
  });

  it('should not return inactive services', async () => {
    mockPrisma.service.findMany.mockResolvedValue(mockService);

    await useCase.execute(businessId);

    expect(mockPrisma.service.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ active: true }),
      }),
    );
  });

  it('should correct services with correct fields', async () => {
    mockPrisma.service.findMany.mockResolvedValue(mockService);

    const result = await useCase.execute(businessId);

    result.forEach((service) => {
      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('price');
      expect(service).toHaveProperty('active');
      expect(service).toHaveProperty('createdAt');
    });
  });
});
