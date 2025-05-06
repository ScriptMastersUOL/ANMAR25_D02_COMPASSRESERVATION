import { IsOptional, IsString, IsIn, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ReservationStatus } from '../../enums/reservation-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindReservationsQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    cpf?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    @IsString()
    @IsIn(['OPEN', 'CANCELED', 'APPROVED', 'CLOSED'])
    status?: ReservationStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    limit: number = 10;
}
