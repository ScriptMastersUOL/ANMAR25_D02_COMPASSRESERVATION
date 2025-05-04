import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt } from 'class-validator';
import { status } from '../../enums/status.enum';

export class CreateReservationDto {
  @ApiProperty()
  @IsInt()
  clientId: number;

  @ApiProperty()
  @IsInt()
  spaceId: number;

  @ApiProperty()
  @IsInt()
  resourceId: number;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;

  @ApiProperty()
  @IsEnum(status)
  status: string;
}
