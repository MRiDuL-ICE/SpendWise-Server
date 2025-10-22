import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const expressApp = express();

let cachedHandler: Express | null = null;

export default async function handler(req: Request, res: Response) {
  if (!cachedHandler) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    app.setGlobalPrefix('api/spend-wise/v1');

    const config = new DocumentBuilder()
      .setTitle('SpendWise API')
      .setDescription('The SpendWise API description')
      .setVersion('1.0')
      .addBearerAuth(
        {
          description: 'Enter JWT token',
          type: 'http',
          in: 'header',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'access-token',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/spend-wise/v1/docs', app, document);

    await app.init();
    cachedHandler = expressApp;
  }

  // ✅ Type-safe call
  return cachedHandler(req, res);
}
