import { PartialType } from '@nestjs/mapped-types';
import { CreateSpaceDto } from './create-space.dto';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSpaceDto extends PartialType(CreateSpaceDto) {
  @ApiPropertyOptional({
    description: 'name of the space',
    example: 'meeting Room B',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'description of the space',
    example: 'updated room for workshops',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'capacity of the space',
    example: 30,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Capacity must be greater or equal to 1' })
  capacity?: number;
}
