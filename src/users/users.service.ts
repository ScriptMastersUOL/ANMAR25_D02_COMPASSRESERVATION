import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, phone, password, name, isActive } = createUserDto;

    const emailExists = await this.prisma.user.findUnique({ where: { email } });
    if (emailExists) {
      throw new ConflictException('Email já cadastrado');
    }

    const phoneExists = await this.prisma.user.findUnique({ where: { phone } });
    if (phoneExists) {
      throw new ConflictException('Telefone já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        isActive: isActive ?? 1,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: secretPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  // retirar depois
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
