import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { user } from './user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, ResetPasswordDto } from './dto/createuserdetails';
import { MailerService } from '@nestjs-modules/mailer';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { updateuserDto } from './dto/updatedto';
import { VerifyDto } from './dto/createuserdetails';
// import * as speakeasy from 'speakeasy';
// import * as qrcode from 'qrcode';
// import { Event } from './eventschema';
@Injectable()
export class UserService {
  getUserById(user_id: any) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(user.name) private userModel: mongoose.Model<user>,
    @InjectModel(Event.name)
    private eventModel: mongoose.Model<Event>,

    // private cacheManager: Cache,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailerService: MailerService,
  ) {}
  async findall(): Promise<user[]> {
    const users = await this.userModel.find();
    return users;
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
  async loginuser(email: string): Promise<user> {
    return this.userModel.findOne({ email }); // Use findOne to query for a user by username
  }
  async generateOtp(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new Error('Email not found');
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
      throw new Error('Invalid OTP');
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
      throw new Error('User not found');
    }

    // Get all events that match user's interests
    const recommendedEvents = await this.eventModel
      .find({ topics: { $in: user.interest } })
      .exec();

    return recommendedEvents;
  }
  async updateUserProfile(id: string, updateUserDto: updateuserDto): Promise<user> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });

      if (!user) {
        throw new NotFoundException('User not found');
      }

    return user;
  }
  async findOneByEmail(email: string): Promise<user | null> {
    const user = await this.userModel.findOne({ email });
    // console.log(user)
    return user;
  }


}
