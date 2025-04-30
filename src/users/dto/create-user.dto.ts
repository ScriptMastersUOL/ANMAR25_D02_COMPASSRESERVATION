/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { isActive } from '../../enums/isActive.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one letter and one number',
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^\+?[0-9\s\-()]{10,20}$/, {
    message: 'Phone number format is invalid',
  })
  phone: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(isActive)
  isActive: number;
}
