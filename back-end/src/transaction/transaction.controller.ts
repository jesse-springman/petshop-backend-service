import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { GetTransaction } from './use-cases/get-transaction';
import { DeleteTransaction } from './use-cases/delete-transaction';
import { CreateTransaction } from './use-cases/post-transaction';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/type/authRequest';
import { CreateTransactionDto } from './dto/transaction.dto';
import { GetTransactionDto } from './dto/get-transaction';

@UseGuards(AuthGuard)
@Controller('transactions')
export class ControllerTransactions {
  constructor(
    private readonly getTransaction: GetTransaction,
    private readonly deleteTransaction: DeleteTransaction,
    private readonly createTransaction: CreateTransaction,
  ) {}

  @Post()
  async create(@Request() req: AuthRequest, @Body() dto: CreateTransactionDto) {
    return this.createTransaction.execute(dto, req.user.businessId);
  }

  @Get()
  async findAll(
    @Request() req: AuthRequest,
    @Query() query: GetTransactionDto,
  ) {
    return this.getTransaction.execute(req.user.businessId, query);
  }

  @Delete(':id')
  async delete(@Request() req: AuthRequest, @Param('id') id: string) {
    return this.deleteTransaction.execute(id, req.user.businessId);
  }
}
