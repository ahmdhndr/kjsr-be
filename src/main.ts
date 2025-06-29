/* istanbul ignore file */
import { AllExceptionsFilter } from '@common/filters';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'pino-nestjs';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useLogger(app.get(Logger));
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://www.kjsr.or.id',
      'https://kjsr.or.id',
    ],
    credentials: true,
  });

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Docs')
    .setDescription('The list of APIs')
    .setVersion('1.0')
    .addTag('Your Great APIs')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory, {
    customSiteTitle: 'API Docs',
    jsonDocumentUrl: 'docs/json',
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = config.get<number>('PORT');
  await app.listen(port!);
}
void bootstrap();
