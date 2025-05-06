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
  @ApiProperty({ description: 'name of the user', example: 'Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'user email address. (must be valid and unique email)',
    example: 'user.name@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'user password. must contain at least 8 characters, including letters and numbers',
    example: 'Password987',
  })
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one letter and one number',
  })
  password: string;

  @ApiProperty({
    description:
      'user phone number. must be a valid phone number with 10 to 20 digits',
    example: '+55 11 97524-6794',
  })
  @IsNotEmpty()
  @Matches(/^\+?[0-9\s\-()]{10,20}$/, {
    message: 'Phone number format is invalid',
  })
  phone: string;

  @ApiProperty({
    description:
      'user status (active or inactive). optional field, defaults to active (1) on creation',
    example: '1',
  })
  @IsOptional()
  @IsEnum(isActive)
  isActive: number;
}
