import { Test, TestingModule } from '@nestjs/testing';
import { PostCustomer } from '../../src/use-cases/post-customer';
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
      customer_name: 'Jesse',
      pet_name: 'Cacau',
    };

    mockPrisma.customer.create.mockResolvedValue(mockReturn);

    const input = {
      customer_name: 'Jesse',
      pet_name: 'Cacau',
      last_bath: new Date(),
      address: 'av luku',
      number_customer: '199934569',
      pet_breed: 'Poodle',
    };

    const result = await service.execute(input);

    expect(mockPrisma.customer.create).toHaveBeenCalledWith({
      data: input,
    });

    expect(result).toEqual(mockReturn);
  });
});
