import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { FindSpacesQueryDto } from './dto/find-spaces-query.dto';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSpaceDto: CreateSpaceDto) {
    const { name, description, capacity } = createSpaceDto;

    const existing = await this.prisma.space.findUnique({ where: { name } });
    if (existing) {
      throw new ConflictException('Space already exists');
    }
    if (createSpaceDto.capacity < 1) {
      throw new BadRequestException(
        'Capacity must be greater than or equal to 1',
      );
    }
    const space = await this.prisma.space.create({
      data: {
        name,
        description,
        capacity: Number(capacity),
        isActive: 1,
      },
    });
    return space;
  }

  async findAll(query: FindSpacesQueryDto) {
    const {
      name = '',
      capacity,
      description,
      status,
      page = 1,
      limit = 10,
    } = query;
    const where: any = {};

    if (name) {
      where.name = { contains: name };
    }
    if (capacity) {
      where.capacity = { gte: Number(capacity) };
    }
    if (description) {
      where.description = { contains: description };
    }
    if (status) {
      where.isActive = status === 'active' ? 1 : 0;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.space.findMany({
        where,
        skip: (page - 1) * limit,
        take: Number(limit),
        select: {
          id: true,
          name: true,
          description: true,
          capacity: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.space.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const space = await this.prisma.space.findUnique({ where: { id } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    return space;
  }

  async update(id: number, updateSpaceDto: UpdateSpaceDto) {
    if (updateSpaceDto.capacity && updateSpaceDto.capacity < 1) {
      throw new BadRequestException('Capacity must be greater or equal to 1');
    }
    const space = await this.prisma.space.findUnique({ where: { id } });
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    if (updateSpaceDto.name) {
      const existing = await this.prisma.space.findUnique({
        where: { name: updateSpaceDto.name },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Name already in use');
      }
    }

    return this.prisma.space.update({
      where: { id },
      data: {
        ...updateSpaceDto,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    const space = await this.prisma.space.findUnique({ where: { id } });

    if (!space) {
      throw new NotFoundException('Space not found');
    }

    return this.prisma.space.update({
      where: { id },
      data: {
        isActive: 0,
        updatedAt: new Date(),
      },
    });
  }
}
