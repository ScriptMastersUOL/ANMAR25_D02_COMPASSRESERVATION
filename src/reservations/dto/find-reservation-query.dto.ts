import { IsOptional, IsString, IsIn, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ReservationStatus } from '../../enums/reservation-status.enum';

export class FindReservationsQueryDto {
    @IsOptional()
    @IsString()
    cpf?: string;

    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    @IsString()
    @IsIn(['OPEN', 'CANCELED', 'APPROVED', 'CLOSED'])
    status?: ReservationStatus;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @Min(1)
    limit: number = 10;
}
