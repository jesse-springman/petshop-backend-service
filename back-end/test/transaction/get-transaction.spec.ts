import { NotFoundException } from '@nestjs/common';
import { mockPrisma } from '../__mocks__/prisma.mock';
import { GetTransaction } from '../../src/transaction/use-cases/get-transaction';

describe('GET /financeiro', ()=> {
    let useCase: GetTransaction;
    const businessId = 'business-test-id'


    const mockTransaction = {
        id: 'transaction',
        type:'INCOME',
        amount: 1000.00,
        createdAt: new Date(),
        category:   "lucro", 
        businessId: "businessId-test",
        appointmentId: "appointmentId-test",
    }

    beforeEach(()=>{
        useCase = new GetTransaction (mockPrisma as any)'
        jest.clearAllMocks();
    })


    it('should return all transaction of a customer', async() => {
        mockPrisma.transaction.findMany.mockResolvedValue([mockTransaction]);

        const result = await useCase.execute()
    })

})

