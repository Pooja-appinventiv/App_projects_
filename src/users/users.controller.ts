import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { user } from './users.schema';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../middleware/jwt-auth.guard';
// import { JwtAuthGuard } from '/jwt-auth.guard';
// import { JwtAuthGuard } from '.src/middleware/jwt-auth.guard.ts';

@Controller('users')
export class UsersController {
  constructor(
    public userService: UsersService,
    private jwtService: JwtService,
  ) {}
  //Basic Authentication strategy by using password and username before hitting api
  //using basic auth in authorization
  @UseGuards(AuthGuard('basic'))
  @Get('/getall')
  async getalluser(): Promise<user[]> {
    return this.userService.findall();
  }
  @UseGuards(AuthGuard('basic'))
  @Post('/signup')
  async signup(@Body() user_details: CreateUserDto) {
    const newUser = await this.userService.createUser(user_details);
    return { message: 'User registered successfully', user: newUser };
  }
  @UseGuards(AuthGuard('basic'))
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findUserByUsername(loginDto.username);
    console.log(user);
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const token = this.jwtService.sign({
      email: user.email,
      username: user.username,
    });
    // if (!user || user.password !== loginDto.password) {
    //   throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    // }
    return { message: 'Login successful', user, token };
  }
  //simple find user by mail
  @Post('/userbyemail')
  async user_by_id(@Body() email_u: user_email) {
    const user = await this.userService.findbyemail(email_u.email);
    return { message: 'found user by email', user };
  }
  //display user profile by using token
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  gethello(@Req() req): any {
    console.log('xyz');
    return req.user;
  }
}
interface CreateUserDto {
  username: string;
  password: string;
  email: string;
}
interface LoginDto {
  username: string;
  password: string;
}
interface user_email {
  email: string;
}
