import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
//data transfer objects
export class CreateadminDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
