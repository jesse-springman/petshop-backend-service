import { Test, TestingModule } from "@nestjs/testing";
import { GetCustomer } from "./get-customer";
import { PrismaService } from "prisma/database/prisma.service";
import e from "express";

describe('GetCustomer', ()=>{
    let dataClient : GetCustomer;
    let prisma : PrismaService

    beforeEach(async()=>{
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                GetCustomer,
                {
                    provide: PrismaService,
                    useValue:{
                        customer:{
                            create: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        dataClient = module.get(GetCustomer);
        prisma = module.get(PrismaService)
    });

    it('must create a client with with success', async()=>{
        const fakeClient = {
            id: '543',
            customer_name: 'Jesse Springman',
            pet_name:'Cacau',
             created_at: new Date(),
        };

        jest.spyOn(prisma.customer, 'create').mockResolvedValue(fakeClient);

        const result = await dataClient.execute();

        expect(result).toEqual(fakeClient);
        expect(result)
    })


    it('must throw InternalServerError in failure', async()=>{
        jest.spyOn(prisma.customer, 'create').mockRejectedValue(new Error('DB error'));

        await expect (dataClient.execute()).rejects.toThrow('Um erro inesperado ocorreu')
    })
})  