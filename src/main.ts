import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API Rest Hamburgueseria')
    .setDescription('API Rest para la hamburguesería')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Empleados')
    .addTag('Usuarios')
    .addTag('Roles')
    .addTag('Categorias')
    .addTag('Productos')
    .addTag('Ventas')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apidoc', app, document);

  await app.listen(process.env.PORT);
  console.log(`App corriendo ${await app.getUrl()}/apidoc`);
}
bootstrap();
