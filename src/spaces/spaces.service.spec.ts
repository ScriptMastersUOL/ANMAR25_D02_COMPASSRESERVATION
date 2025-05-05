import { Test, TestingModule } from '@nestjs/testing';
import { SpacesService } from './spaces.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

describe('SpacesService - create', () => {
  let service: SpacesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpacesService,
        {
          provide: PrismaService,
          useValue: {
            space: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SpacesService>(SpacesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a space with valid data', async () => {
    const dto = { name: 'Room A', description: 'A test room', capacity: 10 };
    jest.spyOn(prisma.space, 'findUnique').mockResolvedValue(null);
    const now = new Date();
    jest.spyOn(prisma.space, 'create').mockResolvedValue({
      id: 1,
      ...dto,
      isActive: 1,
      createdAt: now,
      updatedAt: now,
    });

    const result = await service.create(dto);

    expect(result).toEqual(
      expect.objectContaining({ name: 'Room A', capacity: 10 }),
    );
    expect(prisma.space.create).toHaveBeenCalledWith({
      data: { ...dto, isActive: 1 },
    });
  });

  it('should throw ConflictException if name already exists', async () => {
    const dto = { name: 'Room A', description: 'A test room', capacity: 10 };
    const now = new Date();
    jest.spyOn(prisma.space, 'findUnique').mockResolvedValue({
      id: 1,
      ...dto,
      isActive: 1,
      createdAt: now,
      updatedAt: now,
    });

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('should throw BadRequestException if capacity < 1', async () => {
    const dto = { name: 'Room A', description: 'A test room', capacity: 0 };

    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });
});
describe('SpacesService - update', () => {
  let service: SpacesService;
  let prisma: PrismaService;

  const id = 1;
  const existing = {
    id,
    name: 'Old Room',
    description: 'Old Room description',
    capacity: 10,
    isActive: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    reservations: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpacesService,
        {
          provide: PrismaService,
          useValue: {
            space: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SpacesService>(SpacesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should update a space with valid data', async () => {
    const dto = {
      name: 'Updated Room',
      description: 'Updated Room description',
      capacity: 15,
    };

    jest.spyOn(prisma.space, 'findUnique').mockResolvedValue(existing);
    jest.spyOn(prisma.space, 'update').mockResolvedValue({
      ...existing,
      ...dto,
      updatedAt: new Date(),
    });

    const result = await service.update(id, dto);

    expect(result).toEqual(
      expect.objectContaining({
        name: 'Updated Room',
        description: 'Updated Room description',
        capacity: 15,
        updatedAt: expect.any(Date),
      }),
    );
    expect(prisma.space.update).toHaveBeenCalledWith({
      where: { id },
      data: {
        ...dto,
        updatedAt: expect.any(Date),
      },
    });
  });

  it('should throw NotFoundException if space not found', async () => {
    const dto = {
      name: 'Updated Room',
      description: 'Updated Room description',
      capacity: 15,
    };

    jest.spyOn(prisma.space, 'findUnique').mockResolvedValue(null);

    await expect(service.update(id, dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if capacity < 1', async () => {
    const dto = {
      name: 'Updated Room',
      description: 'Updated Room description',
      capacity: 0,
    };

    await expect(service.update(id, dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if name already exists', async () => {
    const dto = {
      name: 'Updated Room',
      description: 'Updated Room description',
      capacity: 15,
    };

    jest.spyOn(prisma.space, 'findUnique').mockResolvedValue(existing);
    jest
      .spyOn(prisma.space, 'findUnique')
      .mockResolvedValueOnce({ ...existing, name: 'Updated Room' });

    await expect(service.update(id, dto)).rejects.toThrow(BadRequestException);
  });
});
