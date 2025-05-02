import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResourcesService {

  constructor(private readonly prismaService: PrismaService) {}

  async create(createResourceDto: CreateResourceDto) {
    const { name } = createResourceDto;

    const nameExists = await this.prismaService.resource.findUnique({where: { name }})
    if (nameExists) {
      throw new BadRequestException('Resource name already registered');
    }

    return this.prismaService.resource.create({
      data: createResourceDto
    })
  }

  findAll() {
    return `This action returns all resources`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resource`;
  }

  async update(id: number, updateResourceDto: UpdateResourceDto) {
    const resource = await this.prismaService.resource.findUnique({where: { id }})

    if(!resource) {
      throw new BadRequestException('Resource not found')
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

  remove(id: number) {
    return `This action removes a #${id} resource`;
  }
}
