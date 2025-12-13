import { CreateCustomerBody } from 'dto/create.customer';
import { PostCustomer } from 'use-cases/post-customer';
import { GetCustomer } from 'use-cases/get-customer';
export declare class AppController {
    private readonly postCustomer;
    private readonly getCustomer;
    constructor(postCustomer: PostCustomer, getCustomer: GetCustomer);
    insertCustomersData(Body: CreateCustomerBody): Promise<{
        message: string;
        customer_name: String;
        pet_name: String;
    }>;
    allCustomersData(): Promise<{
        id: string;
        customer_name: string;
        pet_name: string;
        created_at: Date;
    }[]>;
}
