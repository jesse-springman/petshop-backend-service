import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/database/prisma.service';
import { aiController } from './ai.controller';
import { GenerateMessage } from './use-cases/post-generate-message';

@Module({
  imports: [],
  controllers: [aiController],
  providers: [PrismaService, GenerateMessage],
})
export class IAModule {}
