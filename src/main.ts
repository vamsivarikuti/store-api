import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { type NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  // app.use()

  const config = new DocumentBuilder()
    .setTitle('Store API')
    .setDescription('The store API description')
    .setVersion('1.0')
    .addTag('store')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
