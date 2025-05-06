import { Test, TestingModule } from '@nestjs/testing';
import { ResourcesService } from './resources.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { isActive } from 'src/enums/isActive.enum';
import { NotFoundException } from '@nestjs/common';

describe('ResourcesService', () => {
  let service: ResourcesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResourcesService, PrismaService],
    }).compile();

    service = module.get<ResourcesService>(ResourcesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a resource with active status', async () => {
      const createResourceDto: CreateResourceDto = {
        name: 'projector',
        quantity: 5,
        description: 'microsoft projector',
        isActive: isActive.active,
      };

      const createdResource = {
        id: 1,
        ...createResourceDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prisma.resource, 'create')
        .mockResolvedValue(createdResource as any);

      const result = await service.create(createResourceDto);
      expect(result).toEqual(createdResource);
    });
  });

  describe('findAll', () => {
    const mockQuery = {
      page: 1,
      limit: 10,
      name: 'projector',
      status: isActive.active,
    };

    const mockResources = [
      {
        id: 1,
        name: 'projector',
        description: 'microsoft projector',
        quantity: 5,
        isActive: isActive.active,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return the filtered resources with pagination', async () => {
      const mockCount = 1;
      const mockTransaction = [mockResources, mockCount];

      jest
        .spyOn(prisma, '$transaction')
        .mockResolvedValue(mockTransaction as any);

      const result = await service.findAll(mockQuery);

      expect(prisma.$transaction).toHaveBeenCalled();

      expect(result).toEqual({
        data: mockResources,
        meta: {
          total: mockCount,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a existing resource by id', async () => {
      const resourceId = 1;
      const mockResource = {
        id: resourceId,
        name: 'projector',
        description: 'microsoft projector',
        quantity: 5,
        isActive: isActive.active,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(prisma.resource, 'findUnique')
        .mockResolvedValue(mockResource as any);

      const result = await service.findOne(resourceId);
      expect(result).toEqual(mockResource);
    });

    it('should throw a error if resource not found', async () => {
      const resourceId = 15;

      jest.spyOn(prisma.resource, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(resourceId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const resourceId = 1;
    const updateDto = {
      name: 'updated projector',
      description: 'new description',
    };

    const existingResource = {
      id: resourceId,
      name: 'projector',
      description: 'microsoft projector',
      quantity: 5,
      isActive: isActive.active,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should update a resource successfully', async () => {
      jest.spyOn(prisma.resource, 'findUnique').mockResolvedValue(existingResource);
      jest
        .spyOn(prisma.resource, 'update')
        .mockResolvedValue({ ...existingResource, ...updateDto, updatedAt: new Date(),} as any);

      const result = await service.update(resourceId, updateDto);

      expect(result).toEqual(expect.objectContaining(updateDto));
      expect(prisma.resource.update).toHaveBeenCalledWith({
        where: { id: resourceId },
        data: {
          ...updateDto,
        }
      });
    });

    it('should throw an error if the resource is not found', async () => {
      jest
        .spyOn(prisma.resource, 'findUnique')
        .mockResolvedValue(null);

      await expect(service.update(resourceId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    const resourceId = 1

    it('should inactivate an existing resource', async () => {
      const existingResource = {
        id: resourceId,
        name: 'projector',
        description: 'microsoft projector',
        quantity: 5,
        isActive: isActive.active,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      jest.spyOn(prisma.resource, 'findUnique').mockResolvedValue(existingResource as any)

      const updatedResource = {
        ...existingResource,
        isActive: isActive.disabled,
        updatedAt: new Date(),
      }

      jest.spyOn(prisma.resource, 'update').mockResolvedValue(updatedResource as any)

      const result = await service.remove(resourceId)

      expect(prisma.resource.update).toHaveBeenCalledWith({
        where: { id: resourceId },
        data: {
          isActive: isActive.disabled,
        }
      })

      expect(result).toEqual(updatedResource)
    })

    it('should throw an error if the resource is not found', async () => {
      jest.spyOn(prisma.resource, 'findUnique').mockResolvedValue(null)

      await expect(service.remove(resourceId)).rejects.toThrow(NotFoundException)
    })
  })
});
