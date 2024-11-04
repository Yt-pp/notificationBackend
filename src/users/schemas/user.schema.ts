// src/users/schemas/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    name?: string;

    @Prop()
    group?: string;

    @Prop({ default: 'user' })
    role?: string;

    @Prop({ type: String })
    fcmToken?: string;
    _id: any;
}

export const UserSchema = SchemaFactory.createForClass(User);
