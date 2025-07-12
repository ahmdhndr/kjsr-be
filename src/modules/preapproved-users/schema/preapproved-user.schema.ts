import { AbstractDocument } from '@common/abstracts/mongo/abstract.schema';
import { STATUS_PREAPPROVAL } from '@common/constants/global.constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class PreapprovedUser extends AbstractDocument {
  @Prop({ unique: true })
  email: string;

  @Prop({
    enum: [
      STATUS_PREAPPROVAL.PENDING,
      STATUS_PREAPPROVAL.APPROVED,
      STATUS_PREAPPROVAL.REJECTED,
    ],
    default: STATUS_PREAPPROVAL.PENDING,
  })
  status: string;

  @Prop({
    type: String,
    default: null,
  })
  registerToken: string | null;

  @Prop({
    type: String,
    default: null,
  })
  reason: string | null;

  @Prop({
    type: Date,
    default: null,
  })
  expiresAt: Date | null;
}

export const PreapprovedUserSchema =
  SchemaFactory.createForClass(PreapprovedUser);
