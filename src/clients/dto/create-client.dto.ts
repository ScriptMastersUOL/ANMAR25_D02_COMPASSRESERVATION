/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { isActive } from 'src/enums/isActive.enum';

export class CreateClientDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'CPF must be in the format 000.000.000-00',
  })
  cpf: string;

  @IsNotEmpty()
  dateOfBirth: Date;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  @IsEnum(isActive)
  isActive: number;
}
