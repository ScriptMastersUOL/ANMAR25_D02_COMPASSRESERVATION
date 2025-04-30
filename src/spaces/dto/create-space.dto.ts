import { IsEnum, IsNotEmpty } from 'class-validator';
import { isActive } from '../../enums/isActive.enum';

export class CreateSpaceDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    capacity: string;

    @IsNotEmpty()
    @IsEnum(isActive)
    isActive: number;
}