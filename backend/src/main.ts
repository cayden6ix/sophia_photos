import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response } from 'express';

const expressApp = express();
let isReady = false;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: false,
  });

  await app.init();
  isReady = true;

  const port = process.env.PORT || 3000;

  // Only listen in non-serverless environment
  if (process.env.VERCEL !== '1') {
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  }
}

const bootstrapPromise = bootstrap();

// Vercel serverless handler
export default async function handler(req: Request, res: Response) {
  if (!isReady) {
    await bootstrapPromise;
  }
  expressApp(req, res);
}
