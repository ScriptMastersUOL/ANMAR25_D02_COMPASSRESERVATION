import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { isActive } from '../enums/isActive.enum';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, phone, password, name, isActive } = createUserDto;

    const emailExists = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (emailExists) {
      throw new ConflictException('Email already registered');
    }

    const phoneExists = await this.prismaService.user.findFirst({
      where: { phone },
    });

    if (phoneExists) {
      throw new ConflictException('Cellphone already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
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

  async findOne(id: number) {
    return this.prismaService.user.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { email, phone, password, name, isActive } = updateUserDto;

    const user = this.prismaService.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    const emailExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (isActive === 0) {
      throw new ConflictException('User is inactive');
    }

    if (emailExists) {
      throw new ConflictException('Email already registered');
    }

    const phoneExists = await this.prismaService.user.findFirst({
      where: { phone },
    });

    if (phoneExists) {
      throw new ConflictException('Cellphone already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (user) {
      return this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          isActive,
        },
      });
    }
  }

  async remove(id: number) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id,
      },
    });

    if (user) {
      return this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          isActive: 0,
        },
      });
    }
  }

  async findAll(query: FindUsersQueryDto) {
    const { name = '', email = '', status, page = 1, limit = 10 } = query;
    const where: any = {};

    if (name) {
      where.name = { contains: name };
    }
    if (email) {
      where.email = { contains: email };
    }
    if (status) {
      where.isActive =
        status === 'active' ? isActive.active : isActive.disabled;
    }

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prismaService.user.count({ where }),
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
}
