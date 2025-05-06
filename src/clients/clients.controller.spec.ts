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
    service = module.get<ClientsService>(ClientsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const createClientDto: CreateClientDto = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        cpf: '123.456.789-00',
        dateOfBirth: new Date('1990-01-01'),
      };

      const expectedResult = {
        id: 1,
        ...createClientDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockClientService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createClientDto);

      expect(result).toEqual(expectedResult);
      expect(mockClientService.create).toHaveBeenCalledWith(createClientDto);
      expect(mockClientService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const query: FindClientsQueryDto = {
        page: 1,
        limit: 10,
      };

      const expectedResult = {
        data: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            cpf: '123.456.789-00',
            dateOfBirth: new Date('1990-01-01'),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockClientService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedResult);
      expect(mockClientService.findAll).toHaveBeenCalledWith(query);
      expect(mockClientService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no clients match query', async () => {
      const query: FindClientsQueryDto = {
        page: 1,
        limit: 10,
      };

      const expectedResult = {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };

      mockClientService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedResult);
      expect(mockClientService.findAll).toHaveBeenCalledWith(query);
      expect(mockClientService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should use default values when query parameters are not provided', async () => {
      const query: FindClientsQueryDto = { page: 1, limit: 10 };

      const expectedResult = {
        data: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            address: '123 Main St',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockClientService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedResult);
      expect(mockClientService.findAll).toHaveBeenCalledWith(query);
      expect(mockClientService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single client by id', async () => {
      const clientId = 1;
      const expectedResult = {
        id: clientId,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        address: '123 Main St',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockClientService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(clientId);

      expect(result).toEqual(expectedResult);
      expect(mockClientService.findOne).toHaveBeenCalledWith(clientId);
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should handle when client is not found', async () => {
      const clientId = 999;
      mockClientService.findOne.mockRejectedValue(new Error('Client not found'));

      await expect(controller.findOne(clientId)).rejects.toThrow('Client not found');
      expect(mockClientService.findOne).toHaveBeenCalledWith(clientId);
      expect(mockClientService.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const clientId = 1;
      const updateClientDto: UpdateClientDto = {
        name: 'John Doe Updated',
        email: 'johnupdated@example.com',
      };

      const expectedResult = {
        id: clientId,
        name: 'John Doe Updated',
        email: 'johnupdated@example.com',
        phone: '1234567890',
        address: '123 Main St',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockClientService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(clientId, updateClientDto);

      expect(result).toEqual(expectedResult);
      expect(mockClientService.update).toHaveBeenCalledWith(clientId, updateClientDto);
      expect(mockClientService.update).toHaveBeenCalledTimes(1);
    });

    it('should handle when client to update is not found', async () => {
      const clientId = 999;
      const updateClientDto: UpdateClientDto = {
        name: 'John Doe Updated',
      };

      mockClientService.update.mockRejectedValue(new Error('Client not found'));

      await expect(controller.update(clientId, updateClientDto)).rejects.toThrow('Client not found');
      expect(mockClientService.update).toHaveBeenCalledWith(clientId, updateClientDto);
      expect(mockClientService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should soft delete a client', async () => {
      const clientId = 1;
      mockClientService.softDeleteClient.mockResolvedValue(undefined);

      const result = await controller.remove(clientId);

      expect(result).toBeUndefined();
      expect(mockClientService.softDeleteClient).toHaveBeenCalledWith(clientId);
      expect(mockClientService.softDeleteClient).toHaveBeenCalledTimes(1);
    });

    it('should handle when client to delete is not found', async () => {
      const clientId = 999;
      mockClientService.softDeleteClient.mockRejectedValue(new Error('Client not found'));

      await expect(controller.remove(clientId)).rejects.toThrow('Client not found');
      expect(mockClientService.softDeleteClient).toHaveBeenCalledWith(clientId);
      expect(mockClientService.softDeleteClient).toHaveBeenCalledTimes(1);
    });

    it('should return HttpStatus.NO_CONTENT', async () => {
      const clientId = 1;
      mockClientService.softDeleteClient.mockResolvedValue(undefined);

      const spy = jest.spyOn(controller, 'remove');
      await controller.remove(clientId);

      const decorators = Reflect.getMetadata('__httpCode__', controller.remove);
      expect(decorators).toBe(HttpStatus.NO_CONTENT);
      expect(spy).toHaveBeenCalledWith(clientId);
      spy.mockRestore();
    });
  });
});