import { SetMetadata } from '@nestjs/common';

export const SUCCESS_RESPONSE_MESSAGE_KEY = 'success:message';

export const SuccessResponseMessage = (message: string) =>
  SetMetadata(SUCCESS_RESPONSE_MESSAGE_KEY, message);
