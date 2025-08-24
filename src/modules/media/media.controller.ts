import { SuccessResponseMessage } from '@common/decorators';
import { Serialize } from '@common/interceptors';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { SerializedMediaDto } from './dto/media.dto';
import { MediaService } from './media.service';

@Controller('media')
@Serialize(SerializedMediaDto)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @SuccessResponseMessage('File uploaded successfully')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: { folder?: string },
  ) {
    const { folder } = data;
    const uploadedResult = await this.mediaService.upload({ file, folder });
    return uploadedResult;
  }

  @Delete('remove')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @SuccessResponseMessage('File deleted successfully')
  async removeFile(@Body() data: { filePath: string }) {
    const { filePath } = data;
    const uploadedResult = await this.mediaService.remove({ path: filePath });
    return uploadedResult;
  }
}
