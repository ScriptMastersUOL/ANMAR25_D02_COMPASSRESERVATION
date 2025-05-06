import { Test, TestingModule } from '@nestjs/testing';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { FindClientsQueryDto } from './dto/find-clients-query.dto';
import { HttpStatus } from '@nestjs/common';

describe('ClientsController', () => {
  let controller: ClientsController;
  let service: ClientsService;

  const mockClientService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDeleteClient: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientsController],
      providers: [
        {
          provide: ClientsService,
          useValue: mockClientService,
        },
      ],
    }).compile();

    controller = module.get<ClientsController>(ClientsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const createClientDto: CreateClientDto = {
        name: 'John Doe',
        email: 'john@example.com',
        cpf: '12345678901',
        phone: '123456789',
        dateOfBirth: new Date('1990-01-01'),
      };
      const expectedResult = { id: 1, ...createClientDto };

      mockClientService.create.mockResolvedValue(expectedResult);

      expect(await controller.create(createClientDto)).toBe(expectedResult);
      expect(mockClientService.create).toHaveBeenCalledWith(createClientDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const query: FindClientsQueryDto = { page: 1, limit: 10 };
      const expectedResult = { data: [], meta: { page: 1, limit: 10, total: 0 } };

      mockClientService.findAll.mockResolvedValue(expectedResult);

      expect(await controller.findAll(query)).toBe(expectedResult);
      expect(mockClientService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      const clientId = 1;
      const expectedResult = { id: clientId, name: 'John Doe', email: 'john@example.com' };

      mockClientService.findOne.mockResolvedValue(expectedResult);

      expect(await controller.findOne(clientId)).toBe(expectedResult);
      expect(mockClientService.findOne).toHaveBeenCalledWith(clientId);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const clientId = 1;
      const updateClientDto: UpdateClientDto = { name: 'Jane Doe' };
      const expectedResult = { id: clientId, name: 'Jane Doe', email: 'john@example.com' };

      mockClientService.update.mockResolvedValue(expectedResult);

      expect(await controller.update(clientId, updateClientDto)).toBe(expectedResult);
      expect(mockClientService.update).toHaveBeenCalledWith(clientId, updateClientDto);
    });
  });

  describe('remove', () => {
    it('should return HttpStatus.NO_CONTENT', async () => {
      const clientId = 1;

      mockClientService.softDeleteClient.mockResolvedValue(undefined);

      const result = await controller.remove(clientId);

      expect(result).toBeUndefined();
      expect(mockClientService.softDeleteClient).toHaveBeenCalledWith(clientId);
    });

    it('should call softDeleteClient with correct id', async () => {
      const clientId = 5;

      mockClientService.softDeleteClient.mockResolvedValue(undefined);

      await controller.remove(clientId);

      expect(mockClientService.softDeleteClient).toHaveBeenCalledTimes(1);
      expect(mockClientService.softDeleteClient).toHaveBeenCalledWith(clientId);
    });
  });
});
