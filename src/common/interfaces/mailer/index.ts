import { OTPType } from '@modules/otp/types/otp.type';
import { User } from '@modules/users/schema/user.schema';
import { SendEmailDto } from '@shared/mail/dto/send-email.dto';

export interface Mailer {
  sendEmail(data: SendEmailDto): Promise<void>;
  emailVerification(user: User, otpType: OTPType): Promise<string | undefined>;
}
