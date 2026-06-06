import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/controller/app.controller';
import { GetCustomer } from '../../src/customer/use-cases/get-customer';
import { PostCustomer } from '../../src/customer/use-cases/post-customer';
import { PatchCustomer } from '../../src/customer/use-cases/patch-customer';
import { DeleteCustomer } from '../../src/customer/use-cases/delete-customer';
import { AuthGuard } from '../../src/auth/auth.guard';

describe('AppController - GET /clientes', () => {
  let controller: AppController;

  const mockGetCustomer = {
    findAllClient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: GetCustomer,
          useValue: mockGetCustomer,
        },
        { provide: PostCustomer, useValue: {} },
        { provide: PatchCustomer, useValue: {} },
        { provide: DeleteCustomer, useValue: {} },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<AppController>(AppController);
  });
  it('should return an array of customers', async () => {
    const mockData = [{ id: 1, name: 'Jesse', phone: '1999939933' }];

    mockGetCustomer.findAllClient.mockResolvedValue(mockData);

    const mockReq = {
      user: {
        sub: 'user-test-id',
        businessId: 'business-test-id',
        role: 'ADMIN',
      },
    };

    const result = await controller.allCustomersData(mockReq as any);

    expect(result).toEqual(mockData);
    expect(mockGetCustomer.findAllClient).toHaveBeenCalledWith(
      'business-test-id',
    );
  });
});
