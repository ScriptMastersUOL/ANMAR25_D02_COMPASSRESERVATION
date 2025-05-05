import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { ClientsModule } from 'src/clients/clients.module';
import { SpacesModule } from 'src/spaces/spaces.module';
import { ResourcesModule } from 'src/resources/resources.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ClientsModule, SpacesModule, ResourcesModule, PrismaModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule { }
