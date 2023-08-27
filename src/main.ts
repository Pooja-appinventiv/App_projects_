import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
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
  await app.listen(5000);
}
bootstrap();
