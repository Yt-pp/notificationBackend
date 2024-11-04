// message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ _id: false })  // Disables _id for the subdocument
export class Recipient {
  @Prop({ required: true })
  userId: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const RecipientSchema = SchemaFactory.createForClass(Recipient);

@Schema()
export class Message {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  senderId: string;

  @Prop({ type: [RecipientSchema], default: [], _id: false })
  recipients: Recipient[];

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
