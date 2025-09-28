import { MongoDatabaseModule } from '@common/databases/mongo/mongo-database.module';
import { LoggerModule } from '@common/logger';
import { ConfigModule } from '@config/config.module';
import { AuthModule } from '@modules/auth/auth.module';
import { OTPModule } from '@modules/otp/otp.module';
import { PreapprovedUsersModule } from '@modules/preapproved-users/preapproved-users.module';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailModule } from '@shared/mail/mail.module';
import { R2Module } from '@shared/r2/r2.module';
import { join } from 'path';

import { ArticlesModule } from './modules/articles/articles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MediaModule } from './modules/media/media.module';
import { StorageModule } from './shared/storage/storage.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MongoDatabaseModule,
    UsersModule,
    AuthModule,
    MailModule,
    OTPModule,
    PreapprovedUsersModule,
    CategoriesModule,
    R2Module,
    MediaModule,
    ArticlesModule,
    StorageModule,
    ServeStaticModule.forRootAsync({
      useFactory: () => {
        const uploadPath = join(__dirname, '..', 'uploads');
        return [
          {
            rootPath: uploadPath,
            serveRoot: '/uploads/',
          },
        ];
      },
    }),
  ],
})
export class AppModule {}
