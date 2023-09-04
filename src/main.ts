import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RabbitMQService } from './modules/rabbitmq/rabbitmq.service';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { dot } from 'node:test/reporters';

async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('virtual event management system')
    .setDescription(' API description')
    .setVersion('1.0')
    .addTag('management')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      },
      'basic',
      )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.DB_PORT);
  const rabbitMQService = app.get(RabbitMQService);
  await rabbitMQService.connect(); 
}
bootstrap();

