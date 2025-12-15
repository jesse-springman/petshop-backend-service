"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const post_customer_1 = require("./post-customer");
const prisma_service_1 = require("../prisma/database/prisma.service");
describe('PostCustomer', () => {
    let dataClient;
    let prisma;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                post_customer_1.PostCustomer,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        customer: {
                            create: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();
        dataClient = module.get(post_customer_1.PostCustomer);
        prisma = module.get(prisma_service_1.PrismaService);
    });
    it('must create a client with with success', async () => {
        const fakeClient = {
            id: '543',
            customer_name: 'Jesse Springman',
            pet_name: 'Cacau',
            created_at: new Date(),
        };
        jest.spyOn(prisma.customer, 'create').mockResolvedValue(fakeClient);
        const result = await dataClient.execute("Jessé", "Cacau");
        expect(result).toEqual(fakeClient);
        expect(prisma.customer.create).toHaveBeenLastCalledWith({
            data: {
                customer_name: "Jessé",
                pet_name: "Cacau"
            }
        });
    });
});
//# sourceMappingURL=post-customer.spec.js.map