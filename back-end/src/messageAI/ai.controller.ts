import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { GenerateMessage } from './use-cases/post-generate-message';
import { GenerarteMessageDto } from './dto/create-message.dto';

@UseGuards(AuthGuard)
@Controller('ai')
export class aiController {
  constructor(private readonly generateMessage: GenerateMessage) {}

  @Post('generate-message')
  async responseIA(@Body() body: GenerarteMessageDto) {
    const result = await this.generateMessage.execute(body);
    return result;
  }
}
