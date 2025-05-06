import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpacesService } from 'src/spaces/spaces.service';
import { ResourcesService } from 'src/resources/resources.service';
import { ClientsService } from 'src/clients/clients.service';
import { BadRequestException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

describe('ReservationsService', () => {
  let service: ReservationsService;
  let prismaService: PrismaService;
  let spacesService: SpacesService;
  let resourcesService: ResourcesService;
  let clientsService: ClientsService;

  const mockPrismaService = {
    reservation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockSpacesService = {
    findOne: jest.fn(),
  };

  const mockResourcesService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockClientsService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SpacesService, useValue: mockSpacesService },
        { provide: ResourcesService, useValue: mockResourcesService },
        { provide: ClientsService, useValue: mockClientsService },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    prismaService = module.get<PrismaService>(PrismaService);
    spacesService = module.get<SpacesService>(SpacesService);
    resourcesService = module.get<ResourcesService>(ResourcesService);
    clientsService = module.get<ClientsService>(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createReservationDto: CreateReservationDto = {
      clientId: 1,
      spaceId: 1,
      resourceId: 1,
      startDate: '2023-01-01T10:00:00Z',
      endDate: '2023-01-01T12:00:00Z',
      status: 'OPEN',
    };

    const mockSpace = { id: 1, name: 'Test Space', isActive: 1 };
    const mockResource = { id: 1, name: 'Test Resource', isActive: 1, quantity: 5 };
    const mockClient = { id: 1, name: 'Test Client', isActive: 1 };
    const mockCreatedReservation = {
      id: 1,
      ...createReservationDto,
      client: { id: 1, name: 'Test Client' },
      space: { id: 1, name: 'Test Space' },
      reservationResources: [{ resource: { id: 1, name: 'Test Resource' } }],
    };

    it('should create a reservation successfully', async () => {
      mockSpacesService.findOne.mockResolvedValue(mockSpace);
      mockResourcesService.findOne.mockResolvedValue(mockResource);
      mockClientsService.findOne.mockResolvedValue(mockClient);
      mockPrismaService.reservation.findFirst.mockResolvedValue(null);
      mockPrismaService.reservation.create.mockResolvedValue(mockCreatedReservation);

      const result = await service.create(createReservationDto);

      expect(result).toEqual(mockCreatedReservation);
      expect(mockResourcesService.update).toHaveBeenCalledWith(1, { ...mockResource, quantity: 4 });
      expect(mockPrismaService.reservation.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException when start date is after end date', async () => {
      const invalidDto = {
        ...createReservationDto,
        startDate: '2023-01-01T14:00:00Z',
        endDate: '2023-01-01T12:00:00Z',
      };

      mockSpacesService.findOne.mockResolvedValue(mockSpace);
      mockResourcesService.findOne.mockResolvedValue(mockResource);
      mockClientsService.findOne.mockResolvedValue(mockClient);

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.reservation.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when space is not active', async () => {
      mockSpacesService.findOne.mockResolvedValue({ ...mockSpace, isActive: 0 });
      mockResourcesService.findOne.mockResolvedValue(mockResource);
      mockClientsService.findOne.mockResolvedValue(mockClient);

      await expect(service.create(createReservationDto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.reservation.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when resource is not active', async () => {
      mockSpacesService.findOne.mockResolvedValue(mockSpace);
      mockResourcesService.findOne.mockResolvedValue({ ...mockResource, isActive: 0 });
      mockClientsService.findOne.mockResolvedValue(mockClient);

      await expect(service.create(createReservationDto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.reservation.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when client is not active', async () => {
      mockSpacesService.findOne.mockResolvedValue(mockSpace);
      mockResourcesService.findOne.mockResolvedValue(mockResource);
      mockClientsService.findOne.mockResolvedValue({ ...mockClient, isActive: 0 });

      await expect(service.create(createReservationDto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.reservation.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when resource quantity is negative', async () => {
      mockSpacesService.findOne.mockResolvedValue(mockSpace);
      mockResourcesService.findOne.mockResolvedValue({ ...mockResource, quantity: -1 });
      mockClientsService.findOne.mockResolvedValue(mockClient);

      await expect(service.create(createReservationDto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.reservation.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when reservation overlaps with another', async () => {
      mockSpacesService.findOne.mockResolvedValue(mockSpace);
      mockResourcesService.findOne.mockResolvedValue(mockResource);
      mockClientsService.findOne.mockResolvedValue(mockClient);
      mockPrismaService.reservation.findFirst.mockResolvedValue({ id: 2 });

      await expect(service.create(createReservationDto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.reservation.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated reservations', async () => {
      const mockReservations = [{ id: 1, status: 'OPEN' }];
      const mockQuery = { page: 1, limit: 10 };
      const mockCount = 1;

      mockPrismaService.reservation.findMany.mockResolvedValue(mockReservations);
      mockPrismaService.reservation.count.mockResolvedValue(mockCount);

      const result = await service.findAll(mockQuery);

      expect(result).toEqual({
        data: mockReservations,
        meta: {
          total: mockCount,
          page: mockQuery.page,
          limit: mockQuery.limit,
          pages: Math.ceil(mockCount / mockQuery.limit),
        },
      });
      expect(mockPrismaService.reservation.findMany).toHaveBeenCalled();
      expect(mockPrismaService.reservation.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a reservation by id', async () => {
      const mockReservation = { id: 1, status: 'OPEN' };
      mockPrismaService.reservation.findUniqueOrThrow.mockResolvedValue(mockReservation);

      const result = await service.findOne(1);

      expect(result).toEqual(mockReservation);
      expect(mockPrismaService.reservation.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          client: true,
          space: true,
          reservationResources: {
            include: {
              resource: true,
            },
          },
        },
      });
    });
  });

  describe('update', () => {
    const updateReservationDto: UpdateReservationDto = {
      startDate: '2023-01-01T10:00:00Z',
      endDate: '2023-01-01T12:00:00Z',
      status: 'APPROVED',
      closedAt: null,
    };

    it('should update a reservation successfully', async () => {
      const mockReservation = { id: 1, status: 'OPEN' };
      const mockUpdatedReservation = { id: 1, status: 'APPROVED' };

      mockPrismaService.reservation.findUniqueOrThrow.mockResolvedValue(mockReservation);
      mockPrismaService.reservation.update.mockResolvedValue(mockUpdatedReservation);

      const result = await service.update(1, updateReservationDto);

      expect(result).toEqual(mockUpdatedReservation);
      expect(mockPrismaService.reservation.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException when trying to cancel directly', async () => {
      const mockReservation = { id: 1, status: 'OPEN' };
      const invalidDto = { ...updateReservationDto, status: 'CANCELED' };

      mockPrismaService.reservation.findUniqueOrThrow.mockResolvedValue(mockReservation);

      await expect(service.update(1, invalidDto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.reservation.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when trying to approve non-open reservation', async () => {
      const mockReservation = { id: 1, status: 'CLOSED' };

      mockPrismaService.reservation.findUniqueOrThrow.mockResolvedValue(mockReservation);

      await expect(service.update(1, updateReservationDto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.reservation.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when start date is after end date', async () => {
      const mockReservation = { id: 1, status: 'OPEN' };
      const invalidDto = {
        ...updateReservationDto,
        startDate: '2023-01-01T14:00:00Z',
        endDate: '2023-01-01T12:00:00Z',
      };

      mockPrismaService.reservation.findUniqueOrThrow.mockResolvedValue(mockReservation);

      await expect(service.update(1, invalidDto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.reservation.update).not.toHaveBeenCalled();
    });

    it('should add closedAt when closing an approved reservation', async () => {
      const mockReservation = { id: 1, status: 'APPROVED' };
      const closeDto = { ...updateReservationDto, status: 'CLOSED' };
      const mockClosedReservation = { id: 1, status: 'CLOSED', closedAt: expect.any(Date) };

      mockPrismaService.reservation.findUniqueOrThrow.mockResolvedValue(mockReservation);
      mockPrismaService.reservation.update.mockResolvedValue(mockClosedReservation);

      const result = await service.update(1, closeDto);

      expect(result).toEqual(mockClosedReservation);
      expect(mockPrismaService.reservation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...closeDto,
          closedAt: expect.any(Date),
        },
      });
    });
  });

  describe('cancelReservation', () => {
    it('should cancel an open reservation', async () => {
      const mockReservation = { id: 1, status: 'OPEN' };
      const mockCanceledReservation = { id: 1, status: 'CANCELED' };

      mockPrismaService.reservation.findUniqueOrThrow.mockResolvedValue(mockReservation);
      mockPrismaService.reservation.update.mockResolvedValue(mockCanceledReservation);

      const result = await service.cancelReservation(1);

      expect(result).toEqual(mockCanceledReservation);
      expect(mockPrismaService.reservation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          status: 'CANCELED',
          updatedAt: expect.any(Date),
        },
        include: {
          client: true,
          space: true,
          reservationResources: {
            include: {
              resource: true,
            },
          },
        },
      });
    });

    it('should throw BadRequestException when trying to cancel non-open reservation', async () => {
      const mockReservation = { id: 1, status: 'APPROVED' };

      mockPrismaService.reservation.findUniqueOrThrow.mockResolvedValue(mockReservation);

      await expect(service.cancelReservation(1)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.reservation.update).not.toHaveBeenCalled();
    });
  });
});