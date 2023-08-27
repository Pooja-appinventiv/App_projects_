import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
//data transfer objects
export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  interest: [string];
}
export class ResetPasswordDto {
  @IsNotEmpty()
  otp: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
