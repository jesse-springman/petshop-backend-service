import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { GenerateMessage } from './use-cases/post-generate-message';
import { GenerarteMessageDto } from './dto/create-message.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiOperation,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('ai')
@Controller('ai')
export class aiController {
  constructor(private readonly generateMessage: GenerateMessage) {}

  @Post('generate-message')
  @ApiOperation({
    summary: 'Cria mensagem personalizada com IA',
    description:
      'Gera uma mensagem automática para o cliente com base no tipo selecionado (lembrete, agendamento ou cobrança).',
  })
  @ApiBody({ type: GenerarteMessageDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Mensagem criada com sucesso',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Esse usuário não foi encontrado',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou não enviado',
  })
  async responseIA(@Body() body: GenerarteMessageDto) {
    const result = await this.generateMessage.execute(body);
    return result;
  }
}
