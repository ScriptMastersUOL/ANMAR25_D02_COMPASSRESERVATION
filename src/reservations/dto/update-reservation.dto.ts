import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { status } from '../../enums/status.enum';

export class UpdateReservationDto {

    @ApiProperty()
    @IsOptional()
    @IsEnum(status)
    status: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    startDate: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    endDate: string;
}
