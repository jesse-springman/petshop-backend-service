import { Test, TestingModule } from '@nestjs/testing';
import { PostCustomer } from '../../src/customer/use-cases/post-customer';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { PrismaService } from '../../src/prisma/database/prisma.service';

describe('PostCustomer', () => {
  let service: PostCustomer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostCustomer,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<PostCustomer>(PostCustomer);
  });
  it('should create a customer', async () => {
    const mockReturn = {
      id: 1,
      name: 'Jesse',
      phone: '199934449',
    };

    mockPrisma.customer.create.mockResolvedValue(mockReturn);

    const input = {
      name: 'Jesse',
      phone: '19993449',
      address: 'av luku',
      businessId: 'business-test-id',
    };

    const result = await service.execute(input, 'business-test-id');

    expect(mockPrisma.customer.create).toHaveBeenCalledWith({
      data: input,
    });

    expect(result).toEqual(mockReturn);
  });
});
