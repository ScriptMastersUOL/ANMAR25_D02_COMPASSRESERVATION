/* eslint-disable prettier/prettier */
import { IsOptional, IsString, IsIn, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { isActive } from 'src/enums/isActive.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindClientsQueryDto {
  @ApiPropertyOptional({
    description: 'partial or full name to filter clients',
    example: 'name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'partial or full email to filter clients',
    example: 'user.name',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'partial or full CPF to filter clients',
    example: '123.456',
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({
    description: 'filter by status (active or disabled)',
    example: 'active',
    enum: ['active', 'disabled'],
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @IsIn([isActive.active, isActive.disabled])
  status?: isActive;

  @ApiPropertyOptional({
    description: 'page number',
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'quantity per page',
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit: number = 10;
}
