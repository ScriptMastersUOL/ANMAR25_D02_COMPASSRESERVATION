import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../enums/reservation-status.enum';

export class UpdateReservationDto {
  @ApiProperty({
    description: 'reservation status',
    example: 'APPROVED',
    enum: ReservationStatus,
  })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status: string;

  @ApiProperty({
    description: 'start date and time',
    example: '2025-06-01T14:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'end date and time',
    example: '2025-06-01T16:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'closed date',
    example: '2025-06-01T16:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  closedAt: string;
}
