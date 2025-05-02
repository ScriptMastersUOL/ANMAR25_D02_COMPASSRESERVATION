import { PartialType } from '@nestjs/mapped-types';
import { CreateSpaceDto } from './create-space.dto';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class UpdateSpaceDto extends PartialType(CreateSpaceDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Capacity must be greater or equal to 1' })
  capacity?: number;
}
