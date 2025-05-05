import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindResourcesQueryDto } from './dto/find-resources-query.dtos';
import { isActive } from 'src/enums/isActive.enum';
import { contains } from 'class-validator';

@Injectable()
export class ResourcesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createResourceDto: CreateResourceDto) {
    const { name } = createResourceDto;

    const nameExists = await this.prismaService.resource.findUnique({
      where: { name },
    });
    if (nameExists) {
      throw new BadRequestException('Resource name already registered');
    }

    return this.prismaService.resource.create({
      data: createResourceDto,
    });
  }

  async findAll(query: FindResourcesQueryDto) {
    const { name = '', status, page = 1, limit = 10 } = query;

    const where: any = {};

    if (name) {
      where.name = { contains: name };
    }

    if (status === 0 || status === 1) {
      where.isActive = status;
    }

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.resource.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          quantity: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prismaService.resource.count({ where }),
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
    const resource = await this.prismaService.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    return resource;
  }

  async update(id: number, updateResourceDto: UpdateResourceDto) {
    const resource = await this.prismaService.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    if (updateResourceDto.name) {
      const nameExists = await this.prismaService.resource.findUnique({
        where: { name: updateResourceDto.name },
      });

      if (nameExists && nameExists.id !== id) {
        throw new BadRequestException('The resource name already exists');
      }
    }

    return this.prismaService.resource.update({
      where: { id },
      data: updateResourceDto,
    });
  }

  async remove(id: number) {
    const resource = await this.prismaService.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }

    const updateResource = await this.prismaService.resource.update({
      where: { id },
      data: { isActive: isActive.disabled },
    });
  }
}
