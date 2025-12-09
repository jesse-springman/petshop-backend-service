import { Test, TestingModule } from "@nestjs/testing";
import { PostCustomer } from "./post-customer";
import { PrismaService } from "prisma/database/prisma.service";



describe('PostCustomer', ()=>{
    let dataClient : PostCustomer;
    let prisma : PrismaService

    beforeEach(async()=>{
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                PostCustomer,
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

        dataClient = module.get(PostCustomer);
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

        const result = await dataClient.execute("Jessé", "Cacau");

        expect(result).toEqual(fakeClient);
        expect(prisma.customer.create).toHaveBeenLastCalledWith({
            data:{
                customer_name: "Jessé",
                pet_name: "Cacau"
            }
        })
    })


})  