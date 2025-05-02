import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { isActive } from '../../enums/isActive.enum';

export class CreateSpaceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsNotEmpty()
  @IsEnum(isActive)
  isActive: number;
}
