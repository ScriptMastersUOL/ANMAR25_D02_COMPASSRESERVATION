import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSpaceDto: CreateSpaceDto) {
    const { name, description, capacity } = createSpaceDto;

    const existing = await this.prisma.space.findUnique({ where: { name } });
    if (existing) {
      throw new ConflictException('Space already exists');
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

  findAll() {
    return `This action returns all spaces`;
  }

  findOne(id: number) {
    return `This action returns a #${id} space`;
  }

  update(id: number, updateSpaceDto: UpdateSpaceDto) {
    return `This action updates a #${id} space`;
  }

  remove(id: number) {
    return `This action removes a #${id} space`;
  }
}
