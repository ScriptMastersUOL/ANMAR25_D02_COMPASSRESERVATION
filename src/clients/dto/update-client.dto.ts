import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClientDto extends PartialType(CreateClientDto) {
  @ApiPropertyOptional({
    description: 'full name of the client',
    example: 'new Client Name',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'CPF (format 000.000.000-00)',
    example: '987.654.321-00',
  })
  cpf?: string;

  @ApiPropertyOptional({
    description: 'new date of birth',
    example: '1985-10-20',
  })
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: 'new client email address',
    example: 'maria.oliveira@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'new phone number (10-20 digits)',
    example: '+55 11 91234-5678',
  })
  phone?: string;
}
