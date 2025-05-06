import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { FindResourcesQueryDto } from './dto/find-resources-query.dtos';
import { isActive } from '../enums/isActive.enum';
import { NotFoundException } from '@nestjs/common';

describe('ResourcesController', () => {
  let controller: ResourcesController;
  let service: ResourcesService;

  const mockResource = {
    id: 1,
    name: 'projector',
    quantity: 5,
    description: 'microsoft projector',
    isActive: isActive.active,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourcesController],
      providers: [
        {
          provide: ResourcesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ResourcesController>(ResourcesController);
    service = module.get<ResourcesService>(ResourcesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a resource and return it', async () => {
      const createResourceDto: CreateResourceDto = {
        name: 'projector',
        quantity: 5,
        description: 'microsoft projector',
        isActive: isActive.active,
      };

      mockService.create.mockResolvedValue(mockResource);

      const result = await controller.create(createResourceDto);

      expect(service.create).toHaveBeenCalledWith(createResourceDto);
      expect(result).toEqual(mockResource);
    });
  });

  describe('findAll', () => {
    it('should return paginated resources with query filters', async () => {
      const query: FindResourcesQueryDto = {
        page: 1,
        limit: 10,
        name: 'projector',
        status: isActive.active,
      };
      const mockResponse = {
        data: [mockResource],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };

      mockService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockResponse);
    });

    it('should handle default query parameters', async () => {
      const query: FindResourcesQueryDto = {};
      const mockResponse = {
        data: [mockResource],
        meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
      };

      mockService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith({}); 
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should return a resource by ID', async () => {
      mockService.findOne.mockResolvedValue(mockResource);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResource);
    });

    it('should throw NotFoundException if resource not found', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException('Resource not found'));

      await expect(controller.findOne('15')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(15);
    });
  });

  describe('update', () => {
    it('should update a resource and return it', async () => {
      const updateResourceDto: UpdateResourceDto = {
        name: 'updated projector',
        description: 'new description',
      };
      const updatedResource = { ...mockResource, ...updateResourceDto };

      mockService.update.mockResolvedValue(updatedResource);

      const result = await controller.update('1', updateResourceDto);

      expect(service.update).toHaveBeenCalledWith(1, updateResourceDto);
      expect(result).toEqual(updatedResource);
    });

    it('should throw NotFoundException if resource not found', async () => {
      const updateResourceDto: UpdateResourceDto = {
        name: 'updated projector',
        description: 'new description',
      };
      mockService.update.mockRejectedValue(new NotFoundException('Resource not found'));

      await expect(controller.update('15', updateResourceDto)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(15, updateResourceDto);
    });
  });

  describe('remove', () => {
    it('should inactivate a resource and return it', async () => {
      const inactivatedResource = { ...mockResource, isActive: isActive.disabled };

      mockService.remove.mockResolvedValue(inactivatedResource);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(inactivatedResource);
    });

    it('should throw NotFoundException if resource not found', async () => {
      mockService.remove.mockRejectedValue(new NotFoundException('Resource not found'));

      await expect(controller.remove('15')).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(15);
    });
  });
});