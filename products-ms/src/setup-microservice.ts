import { ValidationPipe } from '@nestjs/common';

export const setupMicroservice = (app) => {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
};
