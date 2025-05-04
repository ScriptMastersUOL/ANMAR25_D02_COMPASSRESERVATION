import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpacesService } from 'src/spaces/spaces.service';
import { ResourcesService } from 'src/resources/resources.service';
import { ClientsService } from 'src/clients/clients.service';
import { FindReservationsQueryDto } from './dto/find-reservation-query.dto';

@Injectable()
export class ReservationsService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly spacesService: SpacesService,
    private readonly resourcesService: ResourcesService,
    private readonly clientsService: ClientsService,
  ) { }

  async create(createReservationDto: CreateReservationDto) {
    try {
      const space = await this.spacesService.findOne(createReservationDto.spaceId)

      const resource = await this.resourcesService.findOne(createReservationDto.resourceId)

      const client = await this.clientsService.findOne(createReservationDto.clientId)

      const overlappingReservation = await this.prismaService.reservation.findFirst({
        where: {
          spaceId: createReservationDto.spaceId,
          AND: [
            {
              startDate: {
                lt: new Date(createReservationDto.endDate)
              }
            },
            {
              endDate: {
                gt: new Date(createReservationDto.startDate)
              }
            }
          ]
        }
      });

      if (createReservationDto.startDate >= createReservationDto.endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      if (space.isActive === 0) {
        throw new BadRequestException('Space is not active');
      }

      if (resource.isActive === 0) {
        throw new BadRequestException('Resource is not active');
      }

      if (client.isActive === 0) {
        throw new BadRequestException('Client is not active');
      }

      if (resource.quantity < 0) {
        throw new BadRequestException('Resource is not available');
      }

      if (overlappingReservation) {
        throw new BadRequestException('Reservation overlaps with another space');
      }

      if (resource.quantity) {
        resource.quantity = resource.quantity - 1;
        await this.resourcesService.update(resource.id, {
          ...resource,
          quantity: resource.quantity
        })
      }

      return this.prismaService.reservation.create({
        data: {
          ...createReservationDto,
          startDate: new Date(createReservationDto.startDate),
          endDate: new Date(createReservationDto.endDate),
          reservationResources: {
            create: {
              resourceId: createReservationDto.resourceId,
            }
          }
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          space: {
            select: {
              id: true,
              name: true,
            },
          },
          reservationResources: {
            include: {
              resource: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        }
      })

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new BadRequestException('Error creating reservation');
      }
    }
  }


  async update(id: number, updateReservationDto: UpdateReservationDto) {
    try {
      const currentReservation = await this.prismaService.reservation.findUniqueOrThrow({
        where: { id },
      });

      if (updateReservationDto.status === 'CANCELED') {
        throw new BadRequestException('Not allowed to cancel reservation');
      }

      if (updateReservationDto.status === 'APPROVED') {
        if (currentReservation.status !== 'OPEN') {
          throw new BadRequestException('Only open reservations can be approved');
        }
      }

      if (updateReservationDto.startDate >= updateReservationDto.endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      if (updateReservationDto.status === 'CLOSED') {
        if (currentReservation.status !== 'APPROVED') {
          throw new BadRequestException('Only approved reservations can be closed');
        }

        return this.prismaService.reservation.update({
          where: { id },
          data: {
            ...updateReservationDto,
            closedAt: new Date(),
          }
        });
      }

      return this.prismaService.reservation.update({
        where: { id },
        data: updateReservationDto,
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          space: {
            select: {
              id: true,
              name: true,
            },
          },
          reservationResources: {
            include: {
              resource: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        }
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar a reserva: ' + error.message);
    }
  }
}
