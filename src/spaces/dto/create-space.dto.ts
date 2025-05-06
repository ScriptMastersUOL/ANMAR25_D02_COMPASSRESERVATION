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
  @ApiProperty({
    description: 'name of the space',
    example: 'conference Room A',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'description of the space',
    example: 'a space room for meetings and events',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'capacity of the space',
    example: 50,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1, { message: 'Capacity must be greater or equal to 1' })
  capacity: number;

  @ApiProperty({
    description: 'space status (active or disabled)',
    example: 1,
    enum: isActive,
  })
  @IsOptional()
  @IsEnum(isActive)
  isActive?: number;
}
