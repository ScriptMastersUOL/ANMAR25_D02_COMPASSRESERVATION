/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import validator from 'validator';
import { FindClientsQueryDto } from './dto/find-clients-query.dto';

@Injectable()
export class ClientsService {
  remove(arg0: number) {
    throw new Error('Method not implemented.');
  }

  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateClientDto) {
    const { cpf, email, dateOfBirth, phone } = data;

    if (!validator.isEmail(email)) {
      throw new BadRequestException('Email is invalid.');
    }

    if (!/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/.test(cpf)) {
      throw new BadRequestException('Cpf is invalid.');
    }

    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
      throw new BadRequestException('Date Of Birth is invalid.');
    }

    if (!/^\(?\d{2}\)?[\s\-]?\d{4,5}\-?\d{4}$/.test(phone)) {
      throw new BadRequestException('Phone is invalid.');
    }

    const existingClient = await this.prismaService.client.findFirst({
      where: {
        OR: [{ cpf }, { email }],
      },
    });

    if (existingClient) {
      if (existingClient.isActive === 1) {
        throw new BadRequestException('CPF or Email already existing');
      }

      try {
        return await this.prismaService.client.update({
          where: { id: existingClient.id },
          data: {
            ...data,
            dateOfBirth: birthDate, 
            isActive: 1,
            updatedAt: new Date(),
          },
        });
      } catch (error) {
        throw new InternalServerErrorException('Error reactivating client.');
      }
    }

    try {
      return await this.prismaService.client.create({
        data: {
          ...data,
          dateOfBirth: birthDate,
          isActive: 1,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Cpf or email is already in use.');
      }

      throw new InternalServerErrorException('Error creating client.');
    }
  }

  async findAll(query: FindClientsQueryDto) {
    const {
      name = '',
      email = '',
      cpf = '',
      status,
      page = 1,
      limit = 10,
    } = query;
  

    const where: any = { AND: [] };
  
    if (name) {
      where.AND.push({ name: { contains: name } });
    }
    if (email) {
      where.AND.push({ email: { contains: email } });
    }
    if (cpf) {
      where.AND.push({ cpf: { contains: cpf } });
    }
    if (typeof status !== 'undefined') {
      where.AND.push({ isActive: status });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }
  
    const skip = (page - 1) * limit;
    const take = limit;
  
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.client.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          cpf: true,
          email: true,
          phone: true,
          dateOfBirth: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prismaService.client.count({ where }),
    ]);
  
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const client = await this.prismaService.client.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        cpf: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        reservations: true,
      },
    });

    if (!client) {
      throw new NotFoundException(`Client with id=${id} not found.`);
    }

    return client;
  }

  async update(id: number, data: UpdateClientDto) {
    const client = await this.prismaService.client.findUnique({ where: { id } });
  
    if (!client) {
      throw new NotFoundException('Client not found.');
    }

    if (data.email || data.cpf) {
      const existingClient = await this.prismaService.client.findFirst({
        where: {
          OR: [
            data.email ? { email: data.email } : undefined,
            data.cpf ? { cpf: data.cpf } : undefined,
          ].filter(Boolean),
          NOT: { id },
        },
      });
  
      if (existingClient) {
        throw new BadRequestException('Cpf or Email already in use.');
      }
    }
  
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };
  
    if (data.dateOfBirth) {
      const birthDate = new Date(data.dateOfBirth);
      if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
        throw new BadRequestException('Date Of Birth is invalid.');
      }
      updateData.dateOfBirth = birthDate;
    }
  
    try {
      return await this.prismaService.client.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating client.');
    }
  }

  async softDeleteClient(id: number): Promise<void> {
    const client = await this.prismaService.client.findUnique({ where: { id } });
  
    if (!client) {
      throw new NotFoundException('Client not Found');
    }
  
    await this.prismaService.client.update({
      where: { id },
      data: {
        isActive: 0,
        updatedAt: new Date(),
      },
    });
  }
}
