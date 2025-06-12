import { AbstractDocument } from '@common/abstracts/mongo/abstract.schema';
import { ROLES } from '@common/constants/global.constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User extends AbstractDocument {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({
    unique: true,
  })
  username: string;

  @Prop({
    unique: true,
  })
  email: string;

  @Prop({
    enum: [ROLES.ADMIN, ROLES.MEMBER],
    default: ROLES.MEMBER,
  })
  role: string;

  @Prop({
    type: String,
    default: null,
  })
  avatar: string | null;

  @Prop({
    default: false,
  })
  isActive: boolean;

  @Prop({
    default: false,
  })
  isEmailVerified: boolean;

  @Prop({
    type: String,
    default: null,
  })
  activationCode: string | null;

  @Prop()
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(User);
