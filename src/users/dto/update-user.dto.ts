import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'full name of the user. ',
    example: 'new Name',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'user email address.',
    example: 'new.name@example.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description:
      'user password. must contain at least 8 characters, including letters and numbers',
    example: 'NewPass456',
  })
  password?: string;

  @ApiPropertyOptional({
    description:
      'user password. must contain at least 8 characters, including letters and numbers',
    example: '+55 21 91234-5678',
  })
  phone?: string;
}
