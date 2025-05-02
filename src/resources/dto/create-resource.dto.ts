import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateResourceDto {
  @ApiProperty({
    example: 'Projector',
    description: 'The name of the resource (must be unique)',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 10,
    description: 'Available quantity of the resource',
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 'Description of the resource' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
