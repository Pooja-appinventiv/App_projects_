import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { user } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, ResetPasswordDto } from './dto/createuserdetails';
import { JwtAuthGuard } from 'src/middleware/jwt.auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ApiBasicAuth, ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { logoutDtoDto } from './dto/logoutDto';
import { AuthGuard } from '@nestjs/passport';
import { updateuserDto } from './dto/updatedto';
import { ErrorInterceptor } from 'src/error/error.interceptor';

@ApiTags('user')
@Controller('/user')
@UseInterceptors(ErrorInterceptor)
export class UserController {
  constructor(
    public userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // private readonly cacheManager: Cache,
  ) {}
  @Post('/signup')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  async signup(@Body() user_details: CreateUserDto) {
    const newUser = await this.userService.createUser(user_details);
    return { message: 'User registered successfully', user: newUser };
  }
  @UseGuards(AuthGuard('basic'))
  @Get('/getall')
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: user,
    isArray: true,
  })
  async getalluser(): Promise<user[]> {
    return this.userService.findall();
  }
  @Post('/login')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: String,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async login(@Body() loginDto: CreateUserDto) {
    const user = await this.userService.loginuser(loginDto.email);
    console.log(user);
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    if (user.hasTwoFactorAuth) {
      const otpauthUrl = await this.userService.generateSecretKey(user.id);
      const qrCodeImage = await this.userService.generateQRCode(otpauthUrl);
      return { message: 'Login successful', user, qrCodeImage };
    }
    const payload = {
      sub: user['_id'], // Use the MongoDB-generated _id as the subject (sub) of the token
      email: user.email,
      username: user.username,
    };

    const token = this.jwtService.sign(payload);

    // const token = this.jwtService.sign({
    //   email: user.email,
    //   username: user.username,
    // });

    // if (!user || user.password !== loginDto.password) {
    //   throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    // }
    // await this.cacheManager.set(`user:${user['_id']}`, payload, { ttl: 3600 });
    await this.cacheManager.set(`user:${user['email']}`, true); // Set a TTL of 1 hour
    // Set a TTL of 1 hour


    return { message: 'Login successful', user, token };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @ApiHeader({
    name: 'Token',
    description: 'Token',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'User profile data',
  })
  gethello(@Req() req): any {
    console.log('xyz');
    return req.user;
  }

  @UseGuards(AuthGuard('basic'))
  @Post('/generate-otp')
  @ApiResponse({
    status: 200,
    description: 'OTP sent to email',
  })
  @ApiBody({ type: String, description: 'User email' })
  async generateOtp(@Body('email') email: string) {
    try {
      await this.userService.generateOtp(email);
      console.log('kqsjkn');

      return { message: 'Otp send to email' };
    } catch (error) {
      console.log(error);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post('/reset-password')
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const message = await this.userService.resetPassword(resetPasswordDto);
    return { message };
  }
  @Post('/logout')
  @ApiBody({ type: logoutDtoDto })
  @ApiResponse({
    status: 200,
    description: 'User logged out in successfully',
    type: String,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async logout(@Body() logoutDto:logoutDtoDto) {
    const email = logoutDto.email;
    await this.userService.clearUserCache(email);

    return { message: 'Logged out successfully' };
  }
  @Get(':userId/recommenduser')
  async recommendEvents(@Param('userId') userId: string): Promise<Event[]> {
    const recommendedEvents = await this.userService.recommendEventsForUser(
      userId,
    );
    return recommendedEvents;
  }
  @Put(':userid/updateuser')
  @ApiBasicAuth()
  async updateUserProfile(@Param('userid') id: string, @Body() updateUserDto: updateuserDto) {
    try {
      const updatedUser = await this.userService.updateUserProfile(id, updateUserDto);
      return { message: 'User profile updated successfully', user: updatedUser };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

}
