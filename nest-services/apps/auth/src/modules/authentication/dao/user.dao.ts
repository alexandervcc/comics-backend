import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModel } from '../schema/user';
import { Model, mongo } from 'mongoose';

@Injectable()
export class UserDao {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserModel>,
  ) {}

  async checkExistingUser(email: string, username: string) {
    const user = await this.userModel
      .find({ $or: [{ email }, { username }] })
      .exec();
    return user.length > 0;
  }

  async findById(_id: string) {
    return this.userModel.findById(_id);
  }

  async findByUsername(username: string) {
    return (await this.userModel.find({ username })).pop();
  }

  async createUser(user: Omit<User, '_id'>) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async activateUser(_id: mongo.ObjectId) {
    return this.userModel
      .findOneAndUpdate({ _id }, { $set: { active: true } }, { new: true })
      .exec();
  }
}
