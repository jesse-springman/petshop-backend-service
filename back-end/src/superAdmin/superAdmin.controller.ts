import {
  Injectable,
  Body,
  Query,
  Get,
  Patch,
  UseGuards,
  Controller,
  Param,
} from '@nestjs/common';
import { ServicesBusiness } from './admin.service';
import { SuperAdminGuard } from '../auth/superAdmin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateStatusDto } from '../prisma/update-business.dto';

@Controller('superAdmin')
@UseGuards(AuthGuard, SuperAdminGuard)
export class SuperAdminController {
  constructor(private readonly servicesBusiness: ServicesBusiness) {}

  @Get('business')
  findAll() {
    return this.servicesBusiness.findAllBusiness();
  }

  @Patch('business/:id')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.servicesBusiness.updateStatus(id, dto);
  }
}
