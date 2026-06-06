import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/database/prisma.service';
import { VehicleController } from './vehicle.controller';
import { GetVehicle } from './use-cases/vehicle-get';
import { PostVehicle } from './use-cases/vehicle-post';
import { PatchVehicle } from './use-cases/vehicle-patch';
import { DeleteVehicle } from './use-cases/vehicle-delete';

@Module({
  controllers: [VehicleController],
  providers: [
    PrismaService,
    GetVehicle,
    PostVehicle,
    PatchVehicle,
    DeleteVehicle,
  ],
})
export class VehicleModule {}
