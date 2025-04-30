import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  clientId: number;
  @IsInt()
  spaceId: number;
  @IsInt()
  resourceId: number;
  @IsDateString()
  startDate: string;
  @IsDateString()
  endDate: string;
}
