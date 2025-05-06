/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ClientsService } from '../clients/clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindClientsQueryDto } from './dto/find-clients-query.dto';

const clientEntityList: CreateClientDto[] = [
  {
    name: 'Leandro Souza',
    cpf: '343.456.789-00',
    dateOfBirth: new Date('1990-01-01'),
    email: 'lee4edro.souza@example.com',
    phone: '11912345678',
  },
];

describe('ClientsService', () => {
  let service: ClientsService;

  const prismaMock = {
    client: {
      create: jest.fn().mockResolvedValue(clientEntityList[0]),
      findUnique: jest.fn().mockResolvedValue(clientEntityList[0]),
      findMany: jest.fn().mockResolvedValue(clientEntityList),
      update: jest.fn().mockResolvedValue({ ...clientEntityList[0], name: 'Leandro update' }),
      delete: jest.fn(),
      count: jest.fn().mockResolvedValue(1),
      findFirst: jest.fn().mockResolvedValue(null),
    },
    reservation: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
    $transaction: jest.fn().mockImplementation((operations) => Promise.all(operations)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<ClientsService>(ClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a client', async () => {
      const result = await service.create(clientEntityList[0]);
      expect(result).toEqual(clientEntityList[0]);
    });
  });

  describe('findOne', () => {
    it('should return a client by id', async () => {
      const id = 1;
      const result = await service.findOne(id);
      expect(result).toEqual(clientEntityList[0]);
    });
  });

  describe('findAll', () => {
    it('should return an array of clients', async () => {
      const query: FindClientsQueryDto = {
        name: 'Leandro Souza',
        email: 'lee4edro.souza@example.com',
        page: 1,
        limit: 10,
      };

      const result = await service.findAll(query);
      expect(result).toEqual(expect.any(Object));
    });
  });

  describe('update', () => {
    it('should update a client', async () => {
      const id = 1;
      const updateData = { name: 'Leandro update' };
      const result = await service.update(id, updateData);
      expect(result.name).toEqual('Leandro update');
    });
  });

  describe('softDeleteClient', () => {
    it('should throw NotFoundException if client does not exist', async () => {
      prismaMock.client.findUnique.mockResolvedValue(null);

      await expect(service.softDeleteClient(1)).rejects.toThrow('Client not Found');
    });

    it('should throw BadRequestException if client has open or approved reservations', async () => {
      prismaMock.client.findUnique.mockResolvedValue({ id: 1 } as any);
      prismaMock.reservation.findFirst.mockResolvedValue({ id: 1 } as any);

      await expect(service.softDeleteClient(1)).rejects.toThrow(
        'Cannot inactivate client with open or approved reservations.',
      );
    });

    it('should update client to inactive if no open reservations', async () => {
      prismaMock.client.findUnique.mockResolvedValue({ id: 1 } as any);
      prismaMock.reservation.findFirst.mockResolvedValue(null);
      prismaMock.client.update.mockResolvedValue({ id: 1, isActive: 0 } as any);

      await service.softDeleteClient(1);

      expect(prismaMock.client.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: 0, updatedAt: expect.any(Date) },
      });
    });
  });
});
