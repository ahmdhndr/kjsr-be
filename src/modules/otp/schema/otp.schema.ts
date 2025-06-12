import { AbstractDocument } from '@common/abstracts/mongo/abstract.schema';
import { User } from '@modules/users/schema/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

import { OTPType } from '../types/otp.type';

@Schema({ timestamps: true })
export class OTP extends AbstractDocument {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop()
  token: string; // hashed otp for verification or reset password

  @Prop({
    enum: Object.values(OTPType),
    required: true,
  })
  type: string;

  @Prop()
  expiresAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
