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


  const port = Number(process.env.PORT) || appConfig.port || 3000;
  const host = '0.0.0.0';

  await app.listen(port, host);

  const baseUrl = process.env.API_BASE_URL || `http://localhost:${port}`;
  console.log(`Server running on port: ${port}`);
  console.log(`Health check: ${baseUrl}`);
  console.log(`Swagger docs: ${baseUrl}/docs`);
}

bootstrap().catch(err => {
  console.error('Bootstrap failed', err);
  process.exit(1);
});