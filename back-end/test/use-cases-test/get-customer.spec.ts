import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/controller/app.controller';
import { GetCustomer } from '../../src/use-cases/get-customer';
import { PostCustomer } from '../../src/use-cases/post-customer';
import { PatchCustomer } from '../../src/use-cases/patch-customer';
import { DeleteCustomer } from '../../src/use-cases/delete-customer';
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
    const mockData = [{ id: 1, customer_name: 'Jesse', pet_name: 'Cacau' }];

    mockGetCustomer.findAllClient.mockResolvedValue(mockData);

    const result = await controller.allCustomersData();

    expect(result).toEqual(mockData);
    expect(mockGetCustomer.findAllClient).toHaveBeenCalled();
  });
});
