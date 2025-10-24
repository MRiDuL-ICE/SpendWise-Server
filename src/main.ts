// src/main.ts
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/spend-wise/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SpendWise API')
    .setDescription('The SpendWise API description')
    .setVersion('1.0')
    .addTag('SpendWise')
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

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/spend-wise/v1/docs', app, document);

  app.getHttpAdapter().get('/health', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // -------------------------------------------------
  // 4. Port & host – **critical for Railway**
  // -------------------------------------------------
  const port = Number(process.env.PORT) || appConfig.port || 3000;
  const host = '0.0.0.0';

  await app.listen(port, host);

  const baseUrl = process.env.RAILWAY_PUBLIC_URL || `http://localhost:${port}`;
  console.log(`Server running on port: ${port}`);
  console.log(`Health check: ${baseUrl}/health`);
  console.log(`Swagger docs: ${baseUrl}/api/spend-wise/v1/docs`);
}

bootstrap().catch(err => {
  console.error('Bootstrap failed', err);
  process.exit(1);
});