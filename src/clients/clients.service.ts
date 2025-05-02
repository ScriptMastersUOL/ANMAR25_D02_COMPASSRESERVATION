/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import validator from 'validator';

@Injectable()
export class ClientsService {

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

  findAll() {
    return `This action returns all clients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
