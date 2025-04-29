/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'Password must be at least 8 characters long and contain at least one letter and one number',
  })
  password: string;
  @IsNotEmpty()
  @Matches(/^\+?[0-9\s\-()]{10,20}$/, {
    message: 'Phone number format is invalid',
  })
  phone: string;

}
