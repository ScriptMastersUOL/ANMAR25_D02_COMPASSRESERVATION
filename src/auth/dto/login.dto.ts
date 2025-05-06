import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'must be a valid email adress.',
    example: 'user.name@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'must contain at least 8 characters, including letters and numbers',
    example: 'Password987',
  })
  @IsString()
  password: string;
}
