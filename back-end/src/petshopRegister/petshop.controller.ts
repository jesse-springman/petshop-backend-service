import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Injectable,
  Post,
} from '@nestjs/common';
import { PetshopDto } from './petshop.dto';
import { PetshopRegisterService } from './petshop.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Onboarding')
@Controller('Onboarding')
export class PetshopController {
  constructor(
    private readonly petshopRegisterService: PetshopRegisterService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cadastro de novo petshop' })
  async onboarding(@Body() dto: PetshopDto) {
    console.log(dto);
    return this.petshopRegisterService.register(dto);
  }
}
