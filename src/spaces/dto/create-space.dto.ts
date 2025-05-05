import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { isActive } from '../../enums/isActive.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpaceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'Capacity must be greater or equal to 1' })
  capacity: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(isActive)
  isActive?: number;
}
