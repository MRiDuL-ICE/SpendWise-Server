import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/spend-wise/v1');

  const config = new DocumentBuilder()
    .setTitle('SpendWise API')
    .setDescription('The SpendWise API description')
    .setVersion('1.0')
    .addTag('SpendWise')
    .addBearerAuth(
      {
        description: 'Enter JWT token',  // Optional: Custom description
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',  // Name of the auth scheme (used in @ApiBearerAuth)
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/spend-wise/v1/docs', app, documentFactory);
  console.log(`server running on port: ${appConfig.port ?? 3000}`);
  console.log(`swagger link: ${appConfig.apiBaseUrl}/docs`);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
