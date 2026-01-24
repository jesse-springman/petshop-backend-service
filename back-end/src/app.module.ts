import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { PrismaService } from './prisma/database/prisma.service';
import { PostCustomer } from './use-cases/post-customer';
import { GetCustomer } from './use-cases/get-customer';
import { PatchCustomer } from './use-cases/patch-customer';
import { DeleteCustomer } from './use-cases/delete-customer';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env,',
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
