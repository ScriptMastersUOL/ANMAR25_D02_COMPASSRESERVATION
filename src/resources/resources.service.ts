import { ConflictException, Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import validator from 'validator';

@Injectable()
export class ResourcesService {

  constructor(private readonly prismaService: PrismaService) {}

  async create(createResourceDto: CreateResourceDto) {
    const { name } = createResourceDto;

    const nameExists = await this.prismaService.resource.findUnique({where: { name }})
    if (nameExists) {
      throw new ConflictException('Resource name already registered');
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

  update(id: number, updateResourceDto: UpdateResourceDto) {
    return `This action updates a #${id} resource`;
  }

  remove(id: number) {
    return `This action removes a #${id} resource`;
  }
}
