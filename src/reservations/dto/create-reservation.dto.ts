import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt } from 'class-validator';
import { ReservationStatus } from '../../enums/reservation-status.enum';

export class CreateReservationDto {
  @ApiProperty({
    description: 'client ID',
    example: 1,
  })
  @IsInt()
  clientId: number;

  @ApiProperty({
    description: 'space ID',
    example: 2,
  })
  @IsInt()
  spaceId: number;

  @ApiProperty({
    description: 'resource ID',
    example: 3,
  })
  @IsInt()
  resourceId: number;

  @ApiProperty({
    description: 'start date and time',
    example: '2025-06-01T10:00:00Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'end date and time',
    example: '2025-06-01T12:00:00Z',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'reservation status',
    example: 'OPEN',
    enum: ReservationStatus,
  })
  @IsEnum(ReservationStatus)
  status: string;
}
