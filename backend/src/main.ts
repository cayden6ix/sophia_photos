import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Request, Response, NextFunction } from 'express';

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

  // Cache headers para GET /photos (lista de fotos)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' && req.path === '/photos') {
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    }
    next();
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
