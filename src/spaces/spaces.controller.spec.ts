import { Test, TestingModule } from '@nestjs/testing';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { FindSpacesQueryDto } from './dto/find-spaces-query.dto';

describe('SpacesController', () => {
  let controller: SpacesController;
  let service: SpacesService;
  const mockSpace = {
    id: 1,
    name: 'Test Space',
    description: 'A room',
    capacity: 10,
    isActive: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockSpace),
    findAll: jest
      .fn()
      .mockResolvedValue({ data: [mockSpace], meta: { total: 1 } }),
    findOne: jest.fn().mockResolvedValue(mockSpace),
    update: jest.fn().mockResolvedValue({ ...mockSpace, name: 'Updated' }),
    remove: jest.fn().mockResolvedValue({ ...mockSpace, isActive: 0 }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpacesController],
      providers: [
        {
          provide: SpacesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<SpacesController>(SpacesController);
    service = module.get<SpacesService>(SpacesService);
  });

  it('should create a space', async () => {
    const dto: CreateSpaceDto = {
      name: 'Test Space',
      description: 'A room',
      capacity: 10,
    };

    const result = await controller.create(dto);
    expect(result).toEqual(mockSpace);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all spaces with pagination and filters', async () => {
    const query: FindSpacesQueryDto = { page: 1, limit: 10, status: 'active' };

    const result = await controller.findAll(query);
    expect(result).toEqual({ data: [mockSpace], meta: { total: 1 } });
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('should return a space by ID', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockSpace);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a space', async () => {
    const dto: UpdateSpaceDto = { name: 'Updated' };

    const result = await controller.update('1', dto);
    expect(result).toEqual({ ...mockSpace, name: 'Updated' });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should inactivate a space', async () => {
    const result = await controller.remove('1');
    expect(result).toEqual({ ...mockSpace, isActive: 0 });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
