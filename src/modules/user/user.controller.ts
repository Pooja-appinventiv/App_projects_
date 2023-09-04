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
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { user } from './user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, ResetPasswordDto, VerifyDto } from './dto/createuserdetails';
import { JwtAuthGuard } from 'src/middleware/jwt.auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ApiBasicAuth, ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { logoutDtoDto } from './dto/logoutDto';
import { AuthGuard } from '@nestjs/passport';
import { updateuserDto } from './dto/updatedto';
import { I18n, I18nContext } from 'nestjs-i18n';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import * as fs from 'fs-extra';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ErrorInterceptor } from 'src/interceptor/error.interceptor';




@ApiTags('user')
@Controller('/user')
@UseInterceptors(ErrorInterceptor)
export class UserController {
  constructor(
    @InjectModel(user.name) private userModel: mongoose.Model<user>,
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
  async signup(@Body(new ValidationPipe()) user_details: CreateUserDto,@I18n() i18n: I18nContext) {
    const { username, email } = user_details;
    const isUsernameTaken = await this.userService.isUsernameTaken(username);
  const isEmailTaken = await this.userService.isEmailTaken(email);
  if (isUsernameTaken) {
    return {message: i18n.t('test.Usernameisalreadytaken')};
  }
  if (isEmailTaken) {
    return {message: i18n.t('test.Emailisalreadyregistered') };
  }
  const newUser = await this.userService.createUser(user_details);
  return { message: i18n.t('test.User registered successfully'), user: newUser };
    // const newUser = await this.userService.createUser(user_details);
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
  //use new ValidationPipe() for validation
  //first generate otp api hit for qr code ten hit login api 
  async login(@Body() loginDto: CreateUserDto,@I18n() i18n: I18nContext) {
    const user = await this.userService.loginuser(loginDto.email);
    console.log(user);
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException(i18n.t('test.unauthorize'), HttpStatus.UNAUTHORIZED);
    } 
    //token generationn
     
    const payload = {
      sub: user['_id'], // Use the MongoDB-generated _id as the subject (sub) of the token
      email: user.email,
      username: user.username,
    };

    const token = this.jwtService.sign(payload);
    console.log(token)

    // const token = this.jwtService.sign({
    //   email: user.email,
    //   username: user.username,
    // });

    // if (!user || user.password !== loginDto.password) {
    //   throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    // }
    // await this.cacheManager.set(`user:${user['_id']}`, payload, { ttl: 3600 });
    

    await this.cacheManager.set(`user:${user['email']}`, true); 
    // Set a TTL of 1hour
    if ( user.secretKey) {
      console.log(user.secretKey)
      console.log(loginDto.otp)
      const isOTPValid = await this.userService.verifyOTP(user, loginDto.otp);
  
      if (!isOTPValid) {
        throw new HttpException(i18n.t('test.invalidOTP'), HttpStatus.BAD_REQUEST);
      }
    }
    
    ///generation of the qr code fo for the 2fa
    // if (user.hasTwoFactorAuth === true) {
    //   if (!user.secretKey) {
    //     const secret = speakeasy.generateSecret();
    //     const otpauth_url = speakeasy.otpauthURL({
    //       secret: secret.base32,
    //       label: user.email,
    //       issuer: 'google auth',
    //     });
    
    //     user.secretKey = secret.base32;
    //     // user.otpauthUrl = otpauth_url;
    //     await user.save();
    //     const qrCodeImage = await qrcode.toDataURL(otpauth_url);
    //      // Convert the base64 image to binary data
    // const imageData = qrCodeImage.replace(/^data:image\/png;base64,/, '');

    // // Save the image to a file
    // const imagePath = '/home/admin96/Videos/appinventive_projects/virtual_event_management_system/App_projects_/src/modules/user/qrcode.png'; // Change the path as needed
    // await fs.writeFile(imagePath, imageData, 'base64');
    
    //     return { message: 'Please scan the QR code with your authenticator app', qrCodeImage };
    //   }
    //   return { message: 'Please provide OTP code'};
    // }
    //verify the otp for 2fa
    return {message: i18n.t('test.loginSuccesfully'), user, token };
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


  // @UseGuards(AuthGuard('basic'))
  @Post('/generate-otp')
  @ApiResponse({
    status: 200,
    description: 'OTP sent to email',
  })
  @ApiBody({ type: String, description: 'User email' })
  async generateOtp(@Body('email') email: string,@I18n() i18n: I18nContext) {
    await this.userService.generateOtp(email);
    return { message: 'OTP sent to email' };
  }


  @Post('/reset-password')
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully',
  })
  async resetPassword( @Body() resetPasswordDto: ResetPasswordDto,@I18n() i18n: I18nContext): Promise<{ message: string }> {
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
  async logout(@Body() logoutDto:logoutDtoDto,@I18n() i18n: I18nContext) {
    const email = logoutDto.email;
    await this.userService.clearUserCache(email);

    return { message: i18n.t("test.Loggedoutsuccessfully") };
  }

  @Get(':userId/recommenduser')
  async recommendEvents(@Param('userId') userId: string,@I18n() i18n: I18nContext): Promise<Event[]> {
    const recommendedEvents = await this.userService.recommendEventsForUser(
      userId,
    );
    return recommendedEvents;
  }
  @Put(':userid/updateuser')
  @ApiBasicAuth()
  async updateUserProfile(@Param('userid') id: string, @Body() updateUserDto: updateuserDto,@I18n() i18n: I18nContext) {
      const updatedUser = await this.userService.updateUserProfile(id, updateUserDto);
      return { message: i18n.t('test.Userprofileupdatedsuccessfully'), user: updatedUser };
  }

  ///set two factor authentication ,generation of secretkey out side of the log in 
  //and verify inside the login
  @Post('/generateqrcode')
  async generatesecretkey2fa(@Body() loginDto: CreateUserDto,@I18n() i18n: I18nContext) {
    const {email}= loginDto;
    const user= await this.userModel.findOne({email})

    if (user.hasTwoFactorAuth === true) {
      if (!user.secretKey) {
        const secret = speakeasy.generateSecret();
        const otpauth_url = speakeasy.otpauthURL({
          secret: secret.base32,
          label: user.email,
          issuer: 'google_authenticator',
        });
    
        user.secretKey = secret.base32;
        // user.otpauthUrl = otpauth_url;
        await user.save();
        const qrCodeImage = await qrcode.toDataURL(otpauth_url);
         // Convert the base64 image to binary data
    const imageData = qrCodeImage.replace(/^data:image\/png;base64,/, '');

    // Save the image to a file
    const imagePath = '/home/admin96/Videos/appinventive_projects/virtual_event_management_system/App_projects_/src/modules/user/qrcode.png'; // Change the path as needed
    await fs.writeFile(imagePath, imageData, 'base64');
    
        return { message: i18n.t('test.PleasescantheQRcodewithyourauthenticatorapp'), qrCodeImage };
      }
      return { message: i18n.t('test.PleaseprovideOTPcode')};
    }
  }

  // //verifying the otp of 2fa
  // @Post('/verify-otp')
  // async verifyOTP(@Body() verifyDto: VerifyDto) {
  //   // Retrieve the user from the database based on the email
  //   const user = await this.userService.findOneByEmail(verifyDto.email);
  //   console.log("user ",user.secretKey)

  //   if (!user || !user.secretKey) {
  //     throw new HttpException('Invalid user or 2FA not enabled', HttpStatus.BAD_REQUEST);
  //   }

  //   const verified = speakeasy.totp.verify({
  //     secret: user.secretKey,
  //     encoding: 'ascii',
  //     token: verifyDto.otp,
  //   });
  //   console.log("kfkbkwfkjw",verified)
  //   if (!verified) {
  //     throw new HttpException('Invalid OTP code', HttpStatus.BAD_REQUEST);
  //   }
  //   return { message: 'OTP verification successful' };
  // }





}
