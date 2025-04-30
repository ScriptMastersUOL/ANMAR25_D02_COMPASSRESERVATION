import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
    @ApiPropertyOptional({ description: 'New name of the resource' })
  name?: string;

  @ApiPropertyOptional({ example: 'Updated description for the resource' })
  description?: string;
}
