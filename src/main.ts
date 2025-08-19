import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    exceptionFactory: (errors) => {
      const messages = errors.flatMap(err => Object.values(err.constraints || {}));
      return new BadRequestException(messages);
    },
  }));
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
