import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { setupApiDocs } from '@ember-soft/gemello-server-core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  setupApiDocs(app, {
    title: 'Request API',
    description: 'The request api for gemello application',
    version: '1.0',
  });
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'rabbitmq',
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
