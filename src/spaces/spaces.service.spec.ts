import { Test, TestingModule } from '@nestjs/testing';
import { SpacesService } from './spaces.service';
import { PrismaService } from '../prisma/prisma.service';

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
              findUnique: jest.fn().mockResolvedValue(existing),
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

  it('should update a space with partial data (optional fields)', async () => {
    const dto = {
      description: 'Updated Room description',
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
        description: 'Updated Room description',
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
  jest.clearAllMocks();
  it('should throw BadRequestException if capacity < 1', async () => {
    const dto = {
      name: 'Updated Room',
      description: 'Updated Room description',
      capacity: 0,
    };

    jest.spyOn(prisma.space, 'findUnique').mockResolvedValue(existing);

    await expect(service.update(id, dto)).rejects.toThrow(
      'Capacity must be greater or equal to 1',
    );
  });
  it('should throw ConflictException if name already exists', async () => {
    const dto = {
      name: 'Updated Room',
      description: 'Updated Room description',
      capacity: 15,
    };

    jest.clearAllMocks();

    const findUniqueSpy = jest.spyOn(prisma.space, 'findUnique');

    findUniqueSpy.mockResolvedValueOnce(existing);

    findUniqueSpy.mockResolvedValueOnce({
      ...existing,
      id: 999,
      name: dto.name,
    });

    await expect(service.update(id, dto)).rejects.toThrow(
      new ConflictException('Name already in use'),
    );

    expect(findUniqueSpy).toHaveBeenCalledTimes(2);
  });
});
describe('SpacesService - findAll', () => {
  let service: SpacesService;
  let prisma: PrismaService;

  const mockSpaces = [
    {
      id: 1,
      name: 'Room A',
      description: 'A test room',
      capacity: 10,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Room B',
      description: 'Another test room',
      capacity: 20,
      isActive: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpacesService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
            space: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SpacesService>(SpacesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return paginated list of spaces', async () => {
    const query = { page: 1, limit: 2 };

    (prisma.$transaction as jest.Mock).mockResolvedValue([
      mockSpaces,
      mockSpaces.length,
    ]);

    const result = await service.findAll(query);

    expect(result.data.length).toBe(2);
    expect(result.meta.total).toBe(2);
    expect(result.meta.totalPages).toBe(1);
  });

  it('should filter spaces by name', async () => {
    const query = { name: 'Room A', page: 1, limit: 2 };

    (prisma.$transaction as jest.Mock).mockResolvedValue([[mockSpaces[0]], 1]);

    const result = await service.findAll(query);

    expect(result.data).toEqual([mockSpaces[0]]);
    expect(result.meta.total).toBe(1);
  });

  it('should filter spaces by capacity', async () => {
    const query = { capacity: 15, page: 1, limit: 2 };

    (prisma.$transaction as jest.Mock).mockResolvedValue([[mockSpaces[1]], 1]);

    const result = await service.findAll(query);

    expect(result.data).toEqual([mockSpaces[1]]);
    expect(result.meta.total).toBe(1);
  });

  it('should filter spaces by status', async () => {
    const query = {
      status: 'active',
      page: 1,
      limit: 2,
    } as const;

    (prisma.$transaction as jest.Mock).mockResolvedValue([[mockSpaces[0]], 1]);

    const result = await service.findAll(query);

    expect(result.data).toEqual([mockSpaces[0]]);
    expect(result.meta.total).toBe(1);
  });

  it('should return both active and inactive spaces when no status filter is provided', async () => {
    const query = { page: 1, limit: 2 };

    (prisma.$transaction as jest.Mock).mockResolvedValue([
      mockSpaces,
      mockSpaces.length,
    ]);

    const result = await service.findAll(query);

    expect(result.data).toEqual(mockSpaces);
    expect(result.meta.total).toBe(2);
  });
});

describe('SpacesService - findOne', () => {
  let service: SpacesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const prismaMock = {
      space: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpacesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<SpacesService>(SpacesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return a space by ID', async () => {
    const mockSpace = {
      id: 1,
      name: 'Space 1',
      isActive: 1,
      capacity: 10,
      description: 'A test space',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const spaceId = 1;

    jest.spyOn(prisma.space, 'findUnique').mockResolvedValue(mockSpace);

    const result = await service.findOne(spaceId);

    expect(result).toEqual(mockSpace);
  });

  it('should throw an error if space is not found', async () => {
    const spaceId = 999;

    jest.spyOn(prisma.space, 'findUnique').mockResolvedValue(null);

    await expect(service.findOne(spaceId)).rejects.toThrowError(
      'Space not found',
    );
  });
});
describe('SpacesService - delete', () => {
  let service: SpacesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const prismaMock = {
      space: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpacesService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<SpacesService>(SpacesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should inactivate a space and update updatedAt', async () => {
    const spaceId = 1;
    const mockSpace = {
      id: spaceId,
      name: 'Test Space',
      description: 'Some desc',
      capacity: 10,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updatedSpace = {
      ...mockSpace,
      isActive: 0,
      updatedAt: new Date(),
    };

    jest.spyOn(prisma.space, 'findUnique').mockResolvedValue(mockSpace);
    jest.spyOn(prisma.space, 'update').mockResolvedValue(updatedSpace);

    const result = await service.remove(spaceId);

    expect(result.isActive).toBe(0);
    expect(result.updatedAt).toBeInstanceOf(Date);
    expect(result.id).toBe(spaceId);
  });

  it('should throw an error if space is not found', async () => {
    const spaceId = 999;

    jest.spyOn(prisma.space, 'findUnique').mockResolvedValue(null);

    await expect(service.remove(spaceId)).rejects.toThrowError(
      'Space not found',
    );
  });
});
