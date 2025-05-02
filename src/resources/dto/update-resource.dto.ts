import { PartialType } from '@nestjs/mapped-types';
import { CreateResourceDto } from './create-resource.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateResourceDto extends PartialType(CreateResourceDto) {

    @ApiPropertyOptional({ example: 'updated name', description: 'the new name of the resource'})
    name?: string;

    @ApiPropertyOptional({ example: 'updated description', description: 'the new description of the resource'})
    description?: string;
}
