import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/type/authRequest';
import { CreateServiceDto } from './dto/create-service';
import { UpdateServiceDto } from './dto/update-service';
import { CreateService } from './use-cases/post-service';
import { GetService } from './use-cases/get-service';
import { UpdateService } from './use-cases/update-service';
import { DeleteService } from './use-cases/delete-service';

@UseGuards(AuthGuard)
@Controller('Services')
export class ServiceController {
  constructor(
    private createService: CreateService,
    private getService: GetService,
    private updateService: UpdateService,
    private deleteService: DeleteService,
  ) {}

  @Post()
  async create(@Request() req: AuthRequest, @Body() body: CreateServiceDto) {
    return this.createService.execute(body, req.user.businessId);
  }

  @Get()
  async findAll(@Request() req: AuthRequest) {
    return this.getService.execute(req.user.businessId);
  }

  @Patch(':id')
  async update(
    @Request() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: UpdateServiceDto,
  ) {
    return this.updateService.execute(id, body, req.user.businessId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.deleteService.execute(id, req.user.businessId);
  }
}
