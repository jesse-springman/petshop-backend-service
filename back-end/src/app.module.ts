import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { PrismaService } from './prisma/database/prisma.service';
import { PostCustomer } from './customer/use-cases/post-customer';
import { GetCustomer } from './customer/use-cases/get-customer';
import { PatchCustomer } from './customer/use-cases/patch-customer';
import { DeleteCustomer } from './customer/use-cases/delete-customer';
import { AuthModule } from './auth/auth.module';
import { AgendaModule } from './agenda/agenda.module';
import { ConfigModule } from '@nestjs/config';
import { IAModule } from './messageAI/ai.module';
import { BusinessModule } from './businessRegister/business.module';
import { SuperAdminModule } from './superAdmin/superAdmin.module';
import { PetModule } from './pet/pet.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    AuthModule,
    AgendaModule,
    IAModule,
    BusinessModule,
    SuperAdminModule,
    PetModule,
    VehicleModule,
    TransactionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    PostCustomer,
    GetCustomer,
    PatchCustomer,
    DeleteCustomer,
  ],
})
export class AppModule {}
