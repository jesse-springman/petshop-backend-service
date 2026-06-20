import { Module } from '@nestjs/common';
import { ControllerTransactions } from './transaction.controller';
import { PrismaService } from '../prisma/database/prisma.service';
import { GetTransaction } from './use-cases/get-transaction';
import { CreateTransaction } from './use-cases/post-transaction';
import { DeleteTransaction } from './use-cases/delete-transaction';

@Module({
  imports: [],
  controllers: [ControllerTransactions],
  providers: [
    PrismaService,
    GetTransaction,
    CreateTransaction,
    DeleteTransaction,
  ],
  exports: [CreateTransaction], // sera usado no modulo agenda
})
export class TransactionModule {}
