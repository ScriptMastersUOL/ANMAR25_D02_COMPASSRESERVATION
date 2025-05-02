import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { isActive } from '../../enums/isActive.enum';

export class CreateSpaceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'Capacity must be greater or equal to 1' })
  capacity: number;

  @IsNotEmpty()
  @IsEnum(isActive)
  isActive: number;
}
