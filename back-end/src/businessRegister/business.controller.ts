import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
} from '@nestjs/common';
import { BusinessDto } from './business.dto';
import { BusinessRegisterService } from './business.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Onboarding')
@Controller('Onboarding')
export class BusinessController {
  constructor(
    private readonly businessRegisterService: BusinessRegisterService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastro de novo Business' })
  async onboarding(@Body() dto: BusinessDto) {
    console.log('AQUUUIIIIIIII');
    console.log(dto);
    return this.businessRegisterService.register(dto);
  }
}
