"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../app.module");
const prisma_service_1 = require("../prisma/database/prisma.service");
const prisma_mock_1 = require("../__mocks__/prisma.mock");
describe('GET /customers (com Prisma mockado)', () => {
    let app;
    beforeAll(async () => {
        prisma_mock_1.mockPrisma.customer.findMany.mockResolvedValue([
            { id: 1, customer_name: 'Jesse', pet_name: 'Cacau' },
        ]);
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        })
            .overrideProvider(prisma_service_1.PrismaService)
            .useValue(prisma_mock_1.mockPrisma)
            .compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    it('deve retornar um array de customers', async () => {
        const response = await (0, supertest_1.default)(app.getHttpServer())
            .get('/customers')
            .expect(200);
        expect(response.body).toEqual([
            { id: 1, customer_name: 'Jesse', pet_name: 'Cacau' },
        ]);
        expect(prisma_mock_1.mockPrisma.customer.findMany).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=get-customer.spec.js.map