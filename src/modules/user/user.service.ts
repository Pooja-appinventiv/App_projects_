import { Inject, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { user } from './user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, ResetPasswordDto } from './dto/createuserdetails';
import { MailerService } from '@nestjs-modules/mailer';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { updateuserDto } from './dto/updatedto';
import * as speakeasy from 'speakeasy'; 
import { UserNotFoundException } from 'src/interceptor/user.interceptor';

@Injectable()
export class UserService {
  getUserById(user_id: any) {
    throw new NotImplementedException('Method not implemented.');
  }
  constructor(
    @InjectModel(user.name) private userModel: mongoose.Model<user>,
    @InjectModel(Event.name)
    private eventModel: mongoose.Model<Event>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailerService: MailerService,
  ) {}
  
  async findall(): Promise<user[]> {
    const users = await this.userModel.find();
    return users;
  }

  //signup
  async isUsernameTaken(username: string): Promise<boolean> {
    const existingUser = await this.userModel.findOne({ username });
    return !!existingUser;
  }
  async isEmailTaken(email: string): Promise<boolean> {
    const existingUser = await this.userModel.findOne({ email });
    return !!existingUser;
  }
  async createUser(user_details: CreateUserDto): Promise<user> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user_details.password, saltRounds);
    const createdUser = new this.userModel({
      ...user_details,
      password: hashedPassword,
    });
    return createdUser.save();
  }
  
  //login user
  async loginuser(email: string): Promise<user> {
    return this.userModel.findOne({ email }); // Use findOne to query for a user by username
  }

  async generateOtp(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    const OTP = Math.floor(1000 + Math.random() * 9000);
    await this.cacheManager.set(email, OTP);
    const mailOptions = {
      to: email,
      subject: 'Password Reset Request',
      text: `\n\nYOUR RESET PASSWORD OTP IS: ${OTP}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };
    await this.mailerService.sendMail(mailOptions);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const { email, otp, newPassword } = resetPasswordDto;
    const admin = await this.userModel.findOne({ email });
    if (!admin) {
      throw new Error('Invalid User');
    }
    const redisOTP = await this.cacheManager.get(email);
    if (!redisOTP || JSON.stringify(redisOTP) !== otp) {
      throw new NotFoundException('Invalid OTP');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    return 'Password reset successfully';
  }

  async clearUserCache(email: string) {
    await this.cacheManager.del(`user:${email}`);
  }

  async recommendEventsForUser(userId: string): Promise<Event[]> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UserNotFoundException('User not found');
    }
    // Get all events that match user's interests
    const recommendedEvents = await this.eventModel
      .find({ topics: { $in: user.interest } })
      .exec();
    return recommendedEvents;
  }

  async updateUserProfile(id: string, updateUserDto: updateuserDto): Promise<user> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    //   if (!user) {
    //     throw new NotFoundException('User not found');
    //   }
    // return user;
    if (!user) {
      throw new UserNotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<user | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async verifyOTP(user: user, otp: string): Promise<boolean> {
    console.log(user,otp)
    const verified = speakeasy.totp.verify({
      secret: user.secretKey,
      encoding: 'ascii',
      token: otp,
    });
    return verified;
  }


}
