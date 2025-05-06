import { IsOptional, IsString, IsIn, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ReservationStatus } from '../../enums/reservation-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindReservationsQueryDto {
  @ApiPropertyOptional({
    description: 'client CPF',
    example: '123.456.789-00',
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({
    description: 'reservation status',
    example: 'OPEN',
    enum: ['OPEN', 'CANCELED', 'APPROVED', 'CLOSED'],
  })
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  @IsString()
  @IsIn(['OPEN', 'CANCELED', 'APPROVED', 'CLOSED'])
  status?: ReservationStatus;

  @ApiPropertyOptional({
    description: 'page number',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'quantity per page',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit: number = 10;
}
