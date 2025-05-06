import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  let service: ReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            cancelReservation: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call ReservationsService.create with correct data', async () => {
      const dto: CreateReservationDto = {
        clientId: 1,
        spaceId: 2,
        resourceId: 3,
        startDate: '2023-10-01T10:00:00Z',
        endDate: '2023-10-01T12:00:00Z',
        status: 'CONFIRMED',
      };
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call ReservationsService.findAll with correct query', async () => {
      const query = { clientId: 1, page: 1, limit: 10 };
      await controller.findAll(query);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call ReservationsService.findOne with correct id', async () => {
      const id = 1;
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call ReservationsService.update with correct id and data', async () => {
      const id = 1;
      const dto: UpdateReservationDto = {
        status: 'CANCELLED',
        startDate: '2023-10-01T10:00:00Z',
        endDate: '2023-10-01T12:00:00Z',
        closedAt: '2023-10-01T13:00:00Z',
      };
      await controller.update(id, dto);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('cancelReservation', () => {
    it('should call ReservationsService.cancelReservation with correct id', async () => {
      const id = 1;
      await controller.cancelReservation(id);
      expect(service.cancelReservation).toHaveBeenCalledWith(id);
    });
  });
});
