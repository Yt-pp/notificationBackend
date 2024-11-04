// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async findUserByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async getUserById(userId: string): Promise<UserDocument | null> {
        return this.userModel.findById(userId).exec();
    }

    async register(email: string, password: string, name?: string, group?: string, role?: string): Promise<UserDocument> {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({ email, hashedPassword, name, group, role });
        return newUser.save();
    }

    async findAll(): Promise<UserDocument[]> {
        return this.userModel.find({ role: { $ne: 'admin' } }).exec();
    }

    async findUsersByGroup(group: string): Promise<UserDocument[]> {
        return this.userModel.find({ group }).exec();
    }

    async updateFcmToken(userId: string, fcmToken: string): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(userId, { fcmToken }, { new: true }).exec();
    }
}
