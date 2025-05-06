import { IsOptional, IsIn, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindSpacesQueryDto {
  @ApiPropertyOptional({
    description: 'Partial or full name to filter spaces',
    example: 'Conference',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Minimum capacity to filter spaces',
    example: 20,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;

  @ApiPropertyOptional({
    description: 'Filter by status (active or inactive)',
    example: 'active',
    enum: ['active', 'inactive'],
  })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Quantity per page',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit: number = 10;
}
