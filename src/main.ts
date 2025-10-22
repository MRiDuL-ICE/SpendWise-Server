import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('SpendWise API')
    .setDescription('The SpendWise API description')
    .setVersion('1.0')
    .addTag('SpendWise')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  console.log(`server running on port: ${process.env.PORT ?? 3000}`);
  console.log(`swagger link: http://localhost:${process.env.PORT ?? 3000}/api`);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
