import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation(() => 'hashed_password'),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '5511999999999',
      password: 'password123',
      isActive: 1,
    };

    const createdUser = {
      id: 1,
      ...createUserDto,
      password: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a user successfully', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result).not.toHaveProperty('password');
    });

    it('should throw ConflictException if email already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 2, email: createUserDto.email });

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    const userId = 1;
    const user = {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      phone: '5511999999999',
      isActive: 1,
    };

    it('should return a user if found', async () => {
      mockPrismaService.user.findUniqueOrThrow.mockResolvedValue(user);

      const result = await service.findOne(userId);

      expect(mockPrismaService.user.findUniqueOrThrow).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    const userId = 1;
    const updateUserDto = {
      name: 'Updated User',
      email: 'updated@example.com',
      phone: '5511888888888',
      password: 'newpassword123',
      isActive: 1,
    };

    const existingUser = {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      phone: '5511999999999',
      password: 'hashed_old_password',
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedUser = {
      ...existingUser,
      ...updateUserDto,
      password: 'hashed_password',
    };

    it('should update a user successfully', async () => {
      mockPrismaService.user.findUniqueOrThrow.mockResolvedValue(existingUser);
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.findFirst.mockResolvedValue(null);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(mockPrismaService.user.update).toHaveBeenCalled();
      expect(result).toEqual(updatedUser);
    });

    it('should throw ConflictException if isActive is 0', async () => {
      const inactiveDto = { ...updateUserDto, isActive: 0 };

      await expect(service.update(userId, inactiveDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    const userId = 1;
    const existingUser = {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      phone: '5511999999999',
      isActive: 1,
    };

    const deactivatedUser = {
      ...existingUser,
      isActive: 0,
    };

    it('should deactivate a user successfully', async () => {
      mockPrismaService.user.findUniqueOrThrow.mockResolvedValue(existingUser);
      mockPrismaService.user.update.mockResolvedValue(deactivatedUser);

      const result = await service.remove(userId);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { isActive: 0 },
      });
      expect(result).toEqual(deactivatedUser);
    });
  });

  describe('findAll', () => {
    const users = [
      {
        id: 1,
        name: 'User 1',
        email: 'user1@example.com',
        phone: '5511111111111',
        isActive: 1,
      },
      {
        id: 2,
        name: 'User 2',
        email: 'user2@example.com',
        phone: '5511222222222',
        isActive: 1,
      },
    ];

    it('should return paginated users', async () => {
      const total = 2;
      const query = { page: 1, limit: 10 };

      mockPrismaService.$transaction.mockResolvedValue([users, total]);

      const result = await service.findAll(query);

      expect(mockPrismaService.$transaction).toHaveBeenCalled();
      expect(result.data).toEqual(users);
      expect(result.meta.total).toEqual(total);
    });
  });

  describe('findByEmail', () => {
    const email = 'test@example.com';
    const user = {
      id: 1,
      name: 'Test User',
      email,
      phone: '5511999999999',
      password: 'hashed_password',
      isActive: 1,
    };

    it('should return a user by email', async () => {
      mockPrismaService.user.findUniqueOrThrow.mockResolvedValue(user);

      const result = await service.findByEmail(email);

      expect(mockPrismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(user);
    });
  });
});
