import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:5173', 
      'http://localhost:5174', 
      'http://localhost:3000',
      'http://10.0.2.2:3000', // Android Emulator
      'http://localhost:8081', // React Native Metro
    ],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✅ NestJS Server running on http://localhost:${port}`);
}
bootstrap();
