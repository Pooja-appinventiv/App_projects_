import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { user } from './users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(user.name)
    private userModel: Model<user>,
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
  async findUserByUsername(username: string): Promise<user | undefined> {
    return this.userModel.findOne({ username }); // Use findOne to query for a user by username
  }
  async findbyemail(email: string): Promise<user | undefined> {
    return this.userModel.findOne({ email });
  }
}
interface CreateUserDto {
  username: string;
  password: string;
  email: string;
}
