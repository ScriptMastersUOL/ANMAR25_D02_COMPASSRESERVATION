/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({
    description: 'full name of the client',
    example: 'Client Name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'CPF (format 000.000.000-00)',
    example: '123.456.789-00',
  })
  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'CPF must be in the format 000.000.000-00',
  })
  cpf: string;

  @ApiProperty({
    description: 'date of birth',
    example: '1990-05-15',
  })
  @IsNotEmpty()
  dateOfBirth: Date;

  @ApiProperty({
    description: 'client email address',
    example: 'user.name@example.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'phone number (10-20 digits)',
    example: '+55 21 98765-4321',
  })
  @IsNotEmpty()
  phone: string;
}
