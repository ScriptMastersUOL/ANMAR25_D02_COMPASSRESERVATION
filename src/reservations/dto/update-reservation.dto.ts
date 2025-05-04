import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationStatus } from '../../enums/reservation-status.enum';

export class UpdateReservationDto {

    @ApiProperty()
    @IsOptional()
    @IsEnum(ReservationStatus)
    status: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    startDate: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    endDate: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    closedAt: string;
}
