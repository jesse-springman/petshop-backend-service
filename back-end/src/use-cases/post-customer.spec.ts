import { Test, TestingModule } from '@nestjs/testing';
import { PostCustomer } from './post-customer';
import { PrismaService } from '../prisma/database/prisma.service';

describe('PostCustomer', () => {
  let dataClient: PostCustomer;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostCustomer,
        {
          provide: PrismaService,
          useValue: {
            customer: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    dataClient = module.get(PostCustomer);
    prisma = module.get(PrismaService);
  });

  it('must create a client with with success', async () => {
    const DTO = {
      customer_name: 'Jesse Springman',
      pet_name: 'Cacau',
      address: 'ze123',
      number_customer: '22223321',
      pet_breed: 'pit',
      last_bath: new Date('2026-03-30T21:31:18.551Z'),
    };

    const fakeClient = {
      id: '543',
      ...DTO,
      created_at: new Date(),
    };

    jest.spyOn(prisma.customer, 'create').mockResolvedValue(fakeClient as any);

    const result = await dataClient.execute(DTO);

    expect(prisma.customer.create).toHaveBeenLastCalledWith({
      data: DTO,
    });

    expect(result).toEqual(fakeClient);
  });
});
