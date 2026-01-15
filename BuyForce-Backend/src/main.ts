import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);

  console.log('✅ BUYFORCE BACKEND IS RUNNING ON http://localhost:3000');

  // מדפיס את כל ה-routes שנרשמו (Express)
  const server: any = app.getHttpAdapter().getInstance();
  const routes =
    server?._router?.stack
      ?.filter((l: any) => l.route)
      ?.map((l: any) => {
        const methods = Object.keys(l.route.methods)
          .map((m) => m.toUpperCase())
          .join(',');
        return `${methods} ${l.route.path}`;
      }) ?? [];

  console.log('✅ ROUTES:\n' + (routes.length ? routes.join('\n') : '(none)'));
}
bootstrap();
