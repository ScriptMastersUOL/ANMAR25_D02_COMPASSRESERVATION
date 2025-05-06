import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        phone: '7199999-9999',
        isActive: 1,
      };
      const expectedResult = { id: 1, ...createUserDto };

      mockUsersService.create.mockResolvedValue(expectedResult);

      expect(await controller.create(createUserDto)).toBe(expectedResult);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return all users with default pagination', async () => {
      const query: FindUsersQueryDto = { page: 1, limit: 10 };
      const expectedResult = {
        data: [{ id: 1, name: 'Test User' }],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockUsersService.findAll.mockResolvedValue(expectedResult);

      expect(await controller.findAll(query)).toBe(expectedResult);
      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });

    it('should return all users with custom pagination', async () => {
      const query: FindUsersQueryDto = { page: 2, limit: 20 };
      const expectedResult = {
        data: [{ id: 1, name: 'Test User' }],
        total: 1,
        page: 2,
        limit: 20,
      };

      mockUsersService.findAll.mockResolvedValue(expectedResult);

      expect(await controller.findAll(query)).toBe(expectedResult);
      expect(mockUsersService.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 20,
        ...query,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const id = '1';
      const expectedResult = { id: 1, name: 'Test User' };

      mockUsersService.findOne.mockResolvedValue(expectedResult);

      expect(await controller.findOne(id)).toBe(expectedResult);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '1';
      const updateUserDto: UpdateUserDto = { name: 'Updated User' };
      const expectedResult = { id: 1, name: 'Updated User' };

      mockUsersService.update.mockResolvedValue(expectedResult);

      expect(await controller.update(id, updateUserDto)).toBe(expectedResult);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const id = '1';
      const expectedResult = { id: 1, deleted: true };

      mockUsersService.remove.mockResolvedValue(expectedResult);

      expect(await controller.remove(id)).toBe(expectedResult);
      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });
  });
});